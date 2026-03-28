'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Payroll',
  tagline: 'Full-cycle payroll processing with federal and state tax calculations across all 50 states, automated compliance, and tax filing support.',
  accent: '#16a34a',
  productUrl: '/payroll',
  workerUrl: 'https://echo-payroll.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Payroll is an enterprise-grade payroll engine built to handle the full complexity of American payroll — from hourly time entry with overtime auto-split to salaried employees with pre-tax benefit deductions, across all 50 states with correct progressive tax brackets at every level. The pay run lifecycle moves from draft to calculation to manager approval to processing, with every step logged and auditable.',
    'Federal tax withholding follows IRS Publication 15-T tables with support for both old and new Form W-4 formats. State income tax calculations cover all 50 states including reciprocity agreements, supplemental wage rates, and local jurisdictions for cities like New York, Philadelphia, and San Francisco. Employer taxes — Social Security (6.2%), Medicare (1.45%), FUTA (6.0% on first $7,000), and SUTA at state-specific rates — are computed on every pay run and tracked for quarterly filings.',
    'The YTD accumulator tracks every dollar across wages, taxes, and deductions throughout the calendar year, automatically enforcing Social Security wage base limits ($168,600 for 2024) and Additional Medicare Tax thresholds. Benefits administration manages pre-tax deductions (401k, HSA, FSA, health/dental/vision premiums) and post-tax deductions (Roth 401k, life insurance, garnishments) with election-period controls and employer contribution matching. Tax filing support generates 941 quarterly summaries, W-2 year-end data, and 1099-NEC for contractors.',
  ],

  gettingStarted: [
    { step: 1, title: 'Configure Your Company', desc: 'Enter your company EIN, business address, state registrations, and payroll frequency (weekly, bi-weekly, semi-monthly, monthly). Upload your state tax IDs and SUTA rates for each state where you have employees.' },
    { step: 2, title: 'Add Employees', desc: 'Create employee records with personal details, pay type (hourly/salary), pay rate, pay frequency, W-4 filing status, state withholding certificates, and benefit elections. Assign departments and cost centers for reporting.' },
    { step: 3, title: 'Set Up Benefits & Deductions', desc: 'Configure benefit plans — health insurance, dental, vision, 401k with employer match, HSA, FSA. Set employee and employer contribution amounts, pre-tax vs post-tax treatment, and annual limits.' },
    { step: 4, title: 'Enter Time & Run Payroll', desc: 'Submit time entries for hourly employees or confirm salaries for salaried staff. Create a pay run in Draft status, trigger calculation, review the detailed payroll register, then approve to process.' },
    { step: 5, title: 'Review & File', desc: 'Download pay stubs, direct deposit ACH files, and tax liability summaries. Generate 941 quarterly reports and W-2 data at year-end. Monitor YTD totals and wage base limits on the compliance dashboard.' },
  ],

  features: [
    { title: 'All 50 State Tax Calculations', desc: 'State income tax withholding for all 50 states with correct progressive brackets, supplemental wage rates, standard deduction tables, and personal exemption amounts. Updated annually with each state\'s published tax tables.' },
    { title: 'Federal Tax Engine', desc: 'IRS Publication 15-T compliant withholding calculations supporting both 2019 and prior W-4 formats and the 2020+ redesigned W-4. Handles standard withholding, additional per-period amounts, and exempt employees.' },
    { title: 'Pay Run Lifecycle', desc: 'Structured workflow: Draft → Calculate → Review → Approve → Process → Complete. Each stage is logged with timestamps, approver identity, and computed values. Revert to Draft to fix issues before approval.' },
    { title: 'Overtime Auto-Split', desc: 'FLSA-compliant overtime calculation for hourly employees. Automatically splits hours at 40 per week, applies 1.5x multiplier to overtime hours, and handles daily overtime rules for California and other states.' },
    { title: 'YTD Accumulation Engine', desc: 'Real-time year-to-date tracking for gross wages, federal/state/local taxes, every deduction category, and employer taxes. Enforces Social Security wage base limits and Additional Medicare Tax thresholds automatically.' },
    { title: 'Benefits Administration', desc: 'Manage pre-tax deductions (Section 125 health, FSA, HSA, 401k) and post-tax deductions (Roth 401k, garnishments, supplemental life). Election controls, plan-year tracking, and employer contribution matching.' },
    { title: 'Employer Tax Calculations', desc: 'Auto-computes employer FICA (Social Security 6.2%, Medicare 1.45%), FUTA (6.0% with state credit offset), and SUTA at state-specific rates. Tracks quarterly liability for deposit scheduling.' },
    { title: 'Tax Filing Support', desc: 'Generate Form 941 quarterly summaries with line-by-line breakdowns, W-2 data export in EFW2 format for SSA e-filing, and 1099-NEC data for contractor payments. Deposit schedule alerts (monthly vs semi-weekly).' },
    { title: 'Time Entry Management', desc: 'Submit, review, and approve time entries per pay period. Supports regular, overtime, vacation, sick, holiday, and custom pay codes. Bulk entry for managers, with audit trail showing who submitted and approved each entry.' },
    { title: 'Direct Deposit ACH', desc: 'Generate NACHA-formatted ACH files for bank upload. Supports multiple bank accounts per employee (split deposits by percentage or fixed amount). Pre-note validation before first live deposit.' },
    { title: 'Payroll Register & Stubs', desc: 'Detailed payroll register showing every employee\'s gross pay, all tax withholdings, deductions, and net pay per run. Printable/downloadable pay stubs in PDF format with YTD totals.' },
    { title: 'Compliance Dashboard', desc: 'Monitor wage base limits approaching thresholds, missing W-4 forms, expired I-9s, new hire reporting deadlines, and tax deposit schedules. Alerts fire before deadlines, not after.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/api/payroll/runs', desc: 'Create a new pay run for a specified pay period. Returns a run ID in Draft status with the list of included employees and pay period dates.', auth: true },
    { method: 'POST', path: '/api/payroll/runs/:id/calculate', desc: 'Trigger full payroll calculation for a pay run. Computes gross pay, all tax withholdings, deductions, net pay, and employer taxes for every employee. Returns the complete payroll register.', auth: true },
    { method: 'POST', path: '/api/payroll/runs/:id/approve', desc: 'Approve a calculated pay run for processing. Requires manager or admin role. Locks the run and generates ACH file and pay stubs.', auth: true },
    { method: 'GET', path: '/api/payroll/runs/:id/register', desc: 'Retrieve the full payroll register for a pay run — all employees with gross, taxes, deductions, and net pay line items.', auth: true },
    { method: 'GET', path: '/api/employees/:id/ytd', desc: 'Get year-to-date totals for a specific employee: gross wages, federal/state/local taxes withheld, every deduction category, employer FICA, and benefit contributions.', auth: true },
    { method: 'POST', path: '/api/time-entries', desc: 'Submit time entries for one or more employees for a pay period. Accepts regular, overtime, vacation, sick, and custom pay codes.', auth: true },
    { method: 'GET', path: '/api/tax/calculate', desc: 'Calculate federal and state withholding for a given gross amount, filing status, state, W-4 data, and pay frequency. Used for real-time paycheck estimation.', auth: false },
    { method: 'GET', path: '/api/payroll/runs/:id/ach', desc: 'Download the NACHA-formatted ACH direct deposit file for an approved pay run. Ready to upload to your bank or payroll processor.', auth: true },
  ],

  userGuide: [
    {
      id: 'pay-run-lifecycle',
      title: 'Pay Run Lifecycle',
      content: [
        'Every payroll cycle in Echo Payroll follows the same structured lifecycle to ensure accuracy and auditability. Start by navigating to Payroll > New Pay Run, select the pay period dates and payroll frequency, and the system will automatically include all active employees assigned to that schedule.',
        'Once the Draft is created, submit time entries for hourly employees or confirm that salaried employees have no changes. Click "Calculate" to run the full tax engine — this processes every employee\'s gross pay, computes federal and state withholding using current tax tables, applies all pre- and post-tax deductions, and calculates employer taxes. The result is a complete payroll register you can review line by line.',
        'Review the register carefully — check for employees with unexpectedly high or low withholding, verify overtime hours, and confirm benefit deductions match elections. If any corrections are needed, revert to Draft, make changes, and recalculate. Once satisfied, click "Approve" to lock the run. The system generates the ACH direct deposit file, individual pay stubs in PDF, and a tax liability summary for your records.',
      ],
    },
    {
      id: 'tax-calculations',
      title: 'Federal & State Tax Calculations',
      content: [
        'Echo Payroll uses IRS Publication 15-T withholding tables updated each tax year. For employees using the 2020+ Form W-4, the system applies the new Adjusted Wage and Withholding Method — converting the annual withholding allowance, applying the Percentage Method Tables, and adjusting for any additional withholding the employee specified. For pre-2020 W-4s, the Wage Bracket Method is applied using filing status and number of allowances.',
        'State income tax calculations cover all 50 states with the correct progressive bracket tables, standard deductions, personal exemptions, and supplemental wage rates. States with no income tax (TX, FL, WA, NV, WY, SD, AK, NH on wages) are automatically zeroed. States with flat rates (PA at 3.07%, CO at 4.4%) and those with complex progressive systems (CA, NY, NJ) are all handled correctly, including local taxes for NYC, Yonkers, Philadelphia, and other jurisdictions.',
        'The system enforces all wage base limits automatically. Social Security tax stops at $168,600 (2024 limit) and resumes at zero on January 1st. FUTA liability tops out at the $7,000 wage base per employee. The Additional Medicare Tax of 0.9% kicks in at $200,000 for single filers and is tracked against the YTD accumulator. All these limits are updated annually in the tax engine without any action required from you.',
      ],
    },
    {
      id: 'benefits-deductions',
      title: 'Benefits & Deductions',
      content: [
        'Benefits and deductions in Echo Payroll are categorized by their tax treatment. Pre-tax deductions under Section 125 — health, dental, vision premiums, FSA, and traditional 401k contributions — reduce federal and most state taxable wages, lowering both employee withholding and employer FICA on those amounts. HSA contributions also reduce federal taxable income. These are applied before the tax calculation step on every payroll run.',
        'Post-tax deductions include Roth 401k (no current-year tax benefit but tax-free in retirement), supplemental life insurance above the $50,000 threshold (imputed income), wage garnishments (child support, tax levies, student loan garnishments), and voluntary deductions like union dues. Garnishments have priority rules — child support before student loans before consumer debt — and Echo Payroll enforces CCPA maximum withholding limits automatically.',
        'Employer contribution matching for 401k plans is computed on each pay run based on the employee contribution and the match formula (e.g., 100% of first 3% + 50% of next 2%). These amounts are tracked separately from employee deductions and included in the employer cost report. Annual benefit limits (401k IRS limit of $23,000 for 2024, HSA family limit of $8,300) are enforced via the YTD accumulator — contributions stop automatically when the limit is reached.',
      ],
    },
    {
      id: 'time-entry',
      title: 'Time Entry & Overtime',
      content: [
        'Time entries power payroll for hourly and non-exempt employees. Entries can be submitted by employees directly, by managers in bulk for their teams, or imported via the API from a third-party time tracking system. Each entry records the employee, pay period, pay code (Regular, Overtime, PTO, Sick, Holiday, Jury Duty, etc.), date, and hours. Entries require manager approval before they are included in payroll calculation.',
        'Overtime auto-split handles FLSA compliance automatically. For most states, hours exceeding 40 in a workweek are flagged as overtime at 1.5x the regular rate. California employees trigger daily overtime at 8+ hours and double-time at 12+ hours in a single day, plus seventh consecutive day rules. Alaska and Nevada have similar daily overtime requirements — all of these are handled by the overtime engine based on the employee\'s work state.',
        'The system detects workweek boundaries automatically based on your configured workweek start day (Sunday by default, configurable). If a pay period spans two workweeks, overtime is calculated independently for each workweek rather than the pay period total — the legally correct approach that prevents dilution of overtime earned.',
      ],
    },
    {
      id: 'tax-filing',
      title: 'Tax Filing & Compliance',
      content: [
        'Echo Payroll generates the data and reports you need for every major payroll tax filing obligation. Form 941 summaries are available at the end of each quarter showing total wages, federal income tax withheld, employer and employee Social Security and Medicare taxes, and any deposits made. These match exactly to the IRS Form 941 line structure so your accountant or payroll processor can file with confidence.',
        'W-2 generation at year-end uses the SSA\'s EFW2 format for electronic filing. Each employee\'s W-2 data includes Box 1 wages, Box 2 federal withholding, Box 3-4 Social Security wages and tax, Box 5-6 Medicare wages and tax, Box 12 codes for 401k contributions (code D) and HSA contributions (code W), and Box 17 state wages and withholding. Download the formatted data file and upload directly to the SSA\'s Business Services Online portal.',
        'New hire reporting deadlines vary by state (typically 20 days from hire date). The compliance dashboard flags new employees approaching their reporting deadline. 1099-NEC data for contractors paid $600 or more during the year is tracked separately in the contractor payment module and included in the year-end filing package. Tax deposit schedules — monthly depositor vs semi-weekly depositor based on your lookback period liability — are shown on the compliance calendar with deposit due dates for every pay run.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Cost Forecasting', desc: 'Predictive model projects total payroll cost for the next quarter and year based on current headcount, scheduled raises, benefit renewal rates, and seasonal hiring patterns. Includes employer tax burden projections by state for workforce planning decisions.' },
    { capability: 'Anomaly Detection', desc: 'Flags statistically unusual payroll amounts before processing — employees with dramatically higher or lower pay than their prior periods, unexpected overtime spikes, duplicate time entries, or benefit deduction changes that don\'t match approved elections.' },
    { capability: 'Withholding Optimization', desc: 'Analyzes each employee\'s W-4 elections vs their projected annual income to identify those likely to have significant over- or under-withholding at year-end. Proactively suggests W-4 adjustments to avoid large tax bills or refunds.' },
    { capability: 'Compliance Risk Scoring', desc: 'Continuously monitors payroll data against compliance rules — misclassified contractors, minimum wage violations by state, missed new hire reporting, approaching 401k over-contribution, and FMLA eligibility thresholds. Risk scores surface before they become penalties.' },
    { capability: 'Turnover Cost Analysis', desc: 'Calculates the true loaded cost of employee turnover including severance, unemployment insurance rate impact, recruiting costs, and lost productivity. Surfaces retention risk scores based on tenure, pay equity gaps, and benefit utilization patterns.' },
    { capability: 'Benefits Utilization Intelligence', desc: 'Analyzes benefit elections and utilization patterns across the workforce to identify underused benefits, optimize plan design for next renewal period, and surface employees who may benefit from changing their elections during open enrollment.' },
  ],

  troubleshooting: [
    { issue: 'Tax calculation differs from expected amount', solution: 'Verify the employee\'s W-4 data in their profile — filing status, multiple jobs checkbox, dependents amount, other income, deductions, and additional withholding. Confirm the correct pay frequency is set (bi-weekly vs semi-monthly produce different results for the same annual salary). Check that the state withholding certificate reflects current elections. Run a manual estimate using /api/tax/calculate to isolate the specific variable causing the discrepancy.' },
    { issue: 'Employee showing zero state tax withheld', solution: 'Check if the employee\'s work state has no income tax (TX, FL, WA, NV, WY, SD, AK). Verify the employee\'s state withholding certificate isn\'t marked Exempt. Confirm the state is correctly set on the employee record — if the work state and residence state differ, review the reciprocity agreement configuration. Some states require a separate withholding certificate for the employer to withhold.' },
    { issue: 'Social Security not stopping at wage base', solution: 'Confirm the employee\'s YTD gross wages are correctly reflecting all prior pay runs for the calendar year. If an employee started mid-year and YTD from a prior employer isn\'t entered, they may continue having SS withheld past the true annual limit. Enter prior employer YTD wages in the employee record to correctly enforce the annual cap.' },
    { issue: 'ACH file rejected by bank', solution: 'Most ACH rejections are due to incorrect routing number, account number, or account type (checking vs savings). Verify the employee\'s direct deposit info. Check the company\'s originating bank ID and ACH company name match your bank agreement exactly. Prenote validation — sending a $0 test entry — should precede first live deposits for new employees. Contact your bank to get the specific NOC or return reason code from the rejected batch.' },
    { issue: '401k deductions exceeding IRS limit', solution: 'The YTD accumulator should stop 401k deductions automatically when the IRS annual limit is reached. If deductions continued past the limit, check whether multiple 401k plan codes are being used (traditional + Roth are tracked toward the same combined limit). Verify the contribution limit setting in the benefit plan configuration reflects the current year\'s IRS limit. Excess contributions must be returned to the employee before April 15th.' },
  ],

  faq: [
    { q: 'Does Echo Payroll handle multi-state employees?', a: 'Yes. Employees who live in one state and work in another have both states\' taxes calculated, with reciprocity agreements applied where applicable (e.g., an NJ resident working in PA pays NJ income tax, not PA). Remote employees are taxed based on their home state. Employees working in multiple states in a single pay period have wages apportioned and taxed correctly by state.' },
    { q: 'How often are the tax tables updated?', a: 'Federal withholding tables are updated annually in January when the IRS publishes Publication 15-T. State tax tables are updated whenever states publish new withholding rates — many states update in January, but some update mid-year. Echo Payroll deploys tax table updates before their effective dates. Historical tables are retained so past pay runs always produce the correct historical calculation.' },
    { q: 'Can I process off-cycle payrolls for bonuses or corrections?', a: 'Yes. Off-cycle pay runs can be created for any date and any subset of employees. Bonus payrolls use the supplemental wage flat rate method (22% federal, varying state rates) or aggregate method depending on your settings. Correction runs allow you to net out an incorrect pay period and issue a corrected one, with full audit trail documentation.' },
    { q: 'What payroll frequencies are supported?', a: 'Echo Payroll supports weekly (52 periods/year), bi-weekly (26 periods/year), semi-monthly (24 periods/year), and monthly (12 periods/year) schedules. Different employee groups can be on different schedules within the same company. Tax calculations use the correct annualization factor for each frequency per IRS and state rules.' },
    { q: 'How does Echo Payroll handle employee garnishments?', a: 'Wage garnishments — including child support orders, federal and state tax levies, student loan garnishments, and consumer debt garnishments — are entered as post-tax deductions with the garnishment type, amount or percentage, and remittance instructions. The system applies CCPA disposable income limits automatically, calculates the correct withholding amount per pay period, and can generate payment remittance reports for the issuing court or agency.' },
    { q: 'Is there a sandbox mode for testing payroll calculations?', a: 'Yes. The /api/tax/calculate endpoint is public and accepts any combination of gross amount, pay frequency, filing status, state, W-4 parameters, and deductions to return a full tax breakdown without creating any records. Use this for building paycheck estimators, validating your configurations before running live payroll, or testing how changes to employee elections would affect their take-home pay.' },
  ],
}

export default function EchoPayrollDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/payroll' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
