'use client'

import ProductDoc, { ProductDocProps } from '@/components/ProductDoc'
import FaqSchema from '@/components/FaqSchema'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

const data: ProductDocProps = {
  name: 'Echo Tax Returns',
  tagline: 'AI-powered tax preparation, optimization, and e-filing — backed by real IRC authority.',
  accent: '#16a34a',
  productUrl: '/tax-returns',
  workerUrl: 'https://echo-tax-return.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'Echo Tax Returns is a professional-grade tax preparation platform that combines AI-driven automation with rigorous Internal Revenue Code authority. It handles individual returns (1040), business filings (1120, 1120-S, 1065), trust and estate returns (1041), and nonprofit filings (990) — from document ingestion through e-file submission. Every recommendation is backed by specific IRC sections, Treasury Regulations, and relevant case law, giving you defensible positions rather than generic advice.',
    'The AI engine goes far beyond simple form-filling. It ingests W-2s, 1099s, K-1s, and receipts via OCR, auto-populates the correct forms and schedules, and then runs a multi-pass optimization sweep that tests hundreds of election combinations — standard vs. itemized deductions, depreciation methods, entity structure comparisons, income timing strategies — to find the legal minimum tax liability. An audit risk scoring model flags aggressive positions before you file, so you can make informed decisions about each deduction and credit.',
    'Multi-state filing handles apportionment, nexus determination, and state-specific credits automatically. Amendment processing (1040-X) traces changes back to the original return and recalculates cascading effects. Extension filing (4868, 7004) is one-click. And because the entire system runs on Cloudflare Workers with end-to-end encryption, your financial data never touches a traditional server — it is processed at the edge and encrypted at rest in sovereign storage.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Tax Profile', desc: 'Sign up at echo-ept.com/tax-returns and complete your taxpayer profile — filing status, dependents, state of residence, and prior year AGI for identity verification. If you filed with Echo Tax Returns last year, your profile carries forward automatically.' },
    { step: 2, title: 'Upload Tax Documents', desc: 'Upload W-2s, 1099s, K-1s, 1098s, and receipts via drag-and-drop or mobile camera scan. The OCR engine extracts payer names, EINs, amounts, and box codes automatically. Review the extracted data and confirm — manual entry is available for any document the OCR cannot parse.' },
    { step: 3, title: 'Run AI Optimization', desc: 'Click "Optimize" and the AI engine runs a comprehensive analysis: standard vs. itemized comparison, credit eligibility screening (EIC, CTC, education, energy), depreciation method selection, and entity structure evaluation for business filers. Results show your optimized liability with line-by-line IRC citations.' },
    { step: 4, title: 'Review Audit Risk Score', desc: 'Before filing, review the audit risk scorecard. Each line item is scored against IRS DIF (Discriminant Information Function) patterns and historical audit selection rates. High-risk items are flagged with specific mitigation recommendations — additional documentation to retain, alternative reporting positions, or safe harbor elections.' },
    { step: 5, title: 'E-File & Track Status', desc: 'Submit your return electronically to the IRS and applicable state agencies. Track acceptance status in real time — most federal returns are accepted within 24 hours. If rejected, the system diagnoses the rejection code and guides you through the correction. Refund tracking pulls directly from IRS Where\'s My Refund data.' },
  ],

  features: [
    { title: 'Form Auto-Fill', desc: 'OCR engine processes W-2s, 1099-NEC/MISC/INT/DIV/B/R, K-1s, 1098s, and receipt images. Extracts payer information, EINs, amounts, and box codes with 98%+ accuracy. Auto-maps data to the correct forms and schedules — Schedule C, Schedule E, Schedule D, Form 8949, and more.' },
    { title: 'IRC Citation Engine', desc: 'Every optimization recommendation includes the specific IRC section, Treasury Regulation, Revenue Ruling, or Tax Court case that authorizes the position. Citations are hyperlinked to the full legal text. This transforms generic tax advice into defensible, audit-ready positions.' },
    { title: 'Deduction Optimization', desc: 'Multi-pass analysis tests standard vs. itemized deductions, above-the-line adjustments, business expense categorization, home office calculations (simplified vs. actual), vehicle deductions (standard mileage vs. actual), and charitable contribution strategies including bunching and donor-advised fund timing.' },
    { title: 'Multi-State Filing', desc: 'Handles resident, non-resident, and part-year resident returns for all 50 states. Automatic income apportionment for multi-state businesses using three-factor (payroll, property, sales) or single-factor formulas as required by each state. Credits for taxes paid to other states calculated automatically.' },
    { title: 'Audit Risk Scoring', desc: 'Proprietary model scores each return against IRS DIF patterns, Schedule C audit rates by industry NAICS code, and historical enforcement priorities. Individual line items are flagged with risk levels (low, moderate, high) and specific documentation recommendations to support each position if examined.' },
    { title: 'Document OCR', desc: 'Computer vision pipeline processes tax documents in PDF, JPEG, PNG, and HEIC formats. Handles multi-page documents, rotated images, and variable form layouts. Confidence scores on each extracted field let you quickly verify data rather than re-entering it manually.' },
    { title: 'E-Filing', desc: 'IRS Modernized e-File (MeF) integration for federal returns and direct state e-file connections for all participating states. Returns are validated against IRS business rules before submission, catching errors that would cause rejection. Electronic signature via IRS Self-Select PIN or prior year AGI.' },
    { title: 'Tax Planning', desc: 'Year-round tax planning module projects current-year liability based on income trajectory, estimates quarterly payments (Form 1040-ES), models the impact of life events (marriage, home purchase, new business), and recommends year-end strategies like Roth conversions, capital gain harvesting, and retirement contribution timing.' },
    { title: 'Amendment Handling', desc: 'Prepare Form 1040-X amendments with automatic recalculation of cascading effects. Change a W-2 amount and watch AGI, taxable income, credits, and total liability recalculate across all affected forms. Side-by-side comparison shows original vs. amended values for every changed line.' },
    { title: 'Extension Filing', desc: 'One-click extension filing for individuals (Form 4868) and businesses (Form 7004). Estimates tax liability and calculates any payment due with the extension to avoid penalties. Tracks extension deadlines and sends reminders as the extended due date approaches.' },
    { title: 'Business Entity Comparison', desc: 'For business owners, models the total tax burden across entity structures — sole proprietorship, single-member LLC, S-Corp, C-Corp, and partnership — factoring in self-employment tax, qualified business income deduction (199A), reasonable compensation requirements, and state-level entity taxes.' },
    { title: 'Refund Tracking', desc: 'After e-filing, track federal refund status by pulling data from IRS systems. Displays the three-stage progress: Return Received, Refund Approved, Refund Sent. State refund tracking available for participating states. Push notifications when status changes.' },
  ],

  apiEndpoints: [
    { method: 'POST', path: '/api/returns', desc: 'Create a new tax return for a given tax year and filing status. Returns a return ID used for all subsequent document uploads and calculations.', auth: true },
    { method: 'POST', path: '/api/returns/:id/documents', desc: 'Upload a tax document (W-2, 1099, K-1, receipt) as base64 or multipart form data. OCR processes the document and returns extracted fields with confidence scores.', auth: true },
    { method: 'POST', path: '/api/returns/:id/optimize', desc: 'Run the full AI optimization sweep on the return. Returns optimized liability, deduction strategy, credit eligibility, and line-by-line IRC citations. Processing takes 10-30 seconds depending on complexity.', auth: true },
    { method: 'GET', path: '/api/returns/:id/audit-risk', desc: 'Retrieve the audit risk scorecard for a return. Each schedule and major line item includes a risk level, DIF score estimate, and documentation recommendations.', auth: true },
    { method: 'POST', path: '/api/returns/:id/efile', desc: 'Submit the return for e-filing to the IRS and applicable state agencies. Validates against business rules first. Returns a submission ID for tracking acceptance status.', auth: true },
    { method: 'GET', path: '/api/returns/:id/status', desc: 'Check e-file acceptance status, rejection details (if any), and refund tracking information for a submitted return.', auth: true },
    { method: 'POST', path: '/api/returns/:id/amend', desc: 'Create an amendment (1040-X) for a previously filed return. Specify changed fields and the system recalculates all cascading effects automatically.', auth: true },
    { method: 'GET', path: '/api/returns/:id/summary', desc: 'Retrieve the complete return summary including gross income, adjustments, taxable income, tax liability, credits, payments, and refund/amount due.', auth: true },
  ],

  userGuide: [
    {
      title: 'Uploading & Verifying Documents',
      id: 'uploading-documents',
      content: [
        'The document upload flow is designed to minimize manual data entry. Navigate to your return and click "Upload Documents." You can drag and drop files, click to browse, or use the mobile app to scan documents with your phone camera. Supported formats include PDF, JPEG, PNG, and HEIC. Multi-page PDFs are split automatically — each form within the PDF is identified and processed independently.',
        'After upload, the OCR engine extracts all relevant data fields: payer name, payer EIN, recipient information, box amounts, and any special codes. Each extracted value shows a confidence percentage. Fields above 95% confidence are auto-accepted; fields below that threshold are highlighted in yellow for your review. Click any field to edit it manually if the OCR result is incorrect.',
        'The system cross-references uploaded documents against expected information. If you report self-employment income but no Schedule SE data is present, it prompts you. If two 1099-INT forms have the same payer EIN, it flags a potential duplicate. This validation layer catches common errors before they propagate into your return calculations.',
      ],
    },
    {
      title: 'Understanding AI Optimization Results',
      id: 'optimization-results',
      content: [
        'When you click "Optimize," the AI engine performs a comprehensive analysis that goes far beyond choosing standard vs. itemized deductions. It evaluates every applicable election, deduction method, credit, and income timing strategy permitted under the Internal Revenue Code to find the combination that legally minimizes your total tax liability.',
        'Results are presented in a summary dashboard showing your optimized federal liability, effective tax rate, marginal rate, and total savings compared to a naive filing approach. Below the summary, each optimization is listed with the specific IRC section that authorizes it, the dollar impact, and a confidence assessment. For example: "Home Office Deduction (Actual Method) — IRC §280A(c)(1) — saves $3,847 — Confidence: DEFENSIBLE."',
        'The confidence tiers — DEFENSIBLE, MODERATE, AGGRESSIVE, and HIGH RISK — help you make informed decisions. DEFENSIBLE positions are supported by clear statutory language and well-established precedent. AGGRESSIVE positions are legally valid but may attract IRS scrutiny. You can accept or reject each optimization individually, and the return recalculates in real time as you make selections.',
      ],
    },
    {
      title: 'Multi-State Filing',
      id: 'multi-state-filing',
      content: [
        'If you earned income in multiple states or moved during the tax year, Echo Tax Returns handles the complexity automatically. During profile setup, indicate all states where you had income, residency, or filing obligations. The system determines your filing requirement in each state based on income thresholds, physical presence rules, and reciprocity agreements.',
        'For W-2 income earned in a non-resident state, the platform allocates wages to the correct state based on the state tax withholding reported on your W-2. For business income, it applies each state\'s apportionment formula — three-factor (property, payroll, sales) for most states, single-factor sales for states that have adopted market-based sourcing. All apportionment calculations cite the specific state statute.',
        'Credits for taxes paid to other states are calculated automatically to prevent double taxation. The system determines which state gets the primary tax and which state issues the credit based on residency and sourcing rules. Part-year residents get prorated standard deductions and exemptions. The filing order is optimized to maximize credits — some states require you to file the non-resident return first to know the exact credit amount for the resident return.',
      ],
    },
    {
      title: 'Audit Risk & Documentation',
      id: 'audit-risk',
      content: [
        'The audit risk scorecard is your pre-flight checklist before filing. It analyzes every schedule and significant line item on your return against known IRS audit selection patterns. The DIF (Discriminant Information Function) model estimates how your return compares to statistical norms for your income level, filing status, and industry — the same general methodology the IRS uses to select returns for examination.',
        'Each flagged item includes a specific recommendation. For a Schedule C with a high expense-to-income ratio, the system might recommend: "Maintain mileage logs with date, destination, business purpose, and odometer readings per IRC §274(d) and Temp. Reg. §1.274-5T(c)(2). Current ratio of 73% exceeds DIF norm of 52% for NAICS 541990." This level of specificity helps you either strengthen your documentation or reconsider the position.',
        'The overall return risk score ranges from 0 (minimal risk) to 100 (high audit probability). Returns scoring below 30 are well within normal parameters. Returns between 30-60 have individual items that may attract attention but are defensible with proper documentation. Returns above 60 warrant careful review of each flagged item before filing. You can run "what-if" scenarios to see how removing or reducing specific deductions affects the overall risk score.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Deduction Optimization Engine', desc: 'Tests hundreds of election and deduction combinations — depreciation methods (MACRS vs. §179 vs. bonus), standard vs. itemized, vehicle expense methods, home office methods — to find the legal minimum tax liability. Each recommendation cites the specific IRC section, Treasury Regulation, or Revenue Ruling that authorizes the position.' },
    { capability: 'IRC Citation Intelligence', desc: 'Natural language processing maps tax concepts to the specific Internal Revenue Code sections, Treasury Regulations, Revenue Rulings, Revenue Procedures, and Tax Court opinions that apply. Citations are not generic references — they point to the exact subsection and paragraph relevant to your specific fact pattern.' },
    { capability: 'Audit Risk Prediction', desc: 'Machine learning model trained on IRS audit selection patterns scores each return line item. Factors include DIF deviation from statistical norms, Schedule C industry audit rates, historical enforcement priorities, and specific red flags like round numbers, high charitable deductions relative to income, and home office claims.' },
    { capability: 'Document OCR & Classification', desc: 'Computer vision pipeline identifies document type (W-2, 1099 variant, K-1, receipt), extracts all relevant data fields, cross-references payer information against IRS databases, and flags inconsistencies. Handles photographed documents, poor-quality scans, and non-standard layouts with 98%+ field-level accuracy.' },
    { capability: 'Entity Structure Modeling', desc: 'For business owners, simulates total tax burden across entity types (sole prop, LLC, S-Corp, C-Corp, partnership) considering self-employment tax, QBI deduction phase-outs, reasonable compensation requirements, state-level entity taxes, and future exit strategies. Recommends the optimal structure with a full comparison report.' },
    { capability: 'Tax Planning Projections', desc: 'Projects current-year liability based on year-to-date income and withholding, models the impact of proposed transactions (Roth conversion, property sale, stock option exercise), and calculates estimated quarterly payments to avoid underpayment penalties under IRC §6654.' },
  ],

  troubleshooting: [
    { issue: 'OCR extracted incorrect amounts from a document', solution: 'Click the flagged field and manually enter the correct value. For consistently poor OCR results, try rescanning the document with better lighting and contrast — avoid shadows, glare, and angled photos. PDF documents generated directly by payroll providers (not photographed) produce the best results. If a document type is not recognized, use the manual entry form and select the correct document type from the dropdown.' },
    { issue: 'E-file rejected by the IRS', solution: 'The rejection code and description are displayed on the return status page. Common rejections include AGI mismatch (use the exact AGI from your prior year return, or use the IP PIN if issued), duplicate SSN (someone else already filed using that SSN — contact the IRS Identity Protection unit), and schema validation errors (a field exceeds the allowed length or format). Fix the identified issue and resubmit — there is no penalty for rejected-and-corrected returns.' },
    { issue: 'State return calculations seem incorrect', solution: 'Verify your residency status for each state is correctly set — resident, non-resident, or part-year. Check that W-2 state wage allocations match box 16 on your actual W-2. For business income apportionment, confirm your property, payroll, and sales factors are entered for each state. Some states have unique adjustments (e.g., California does not conform to federal bonus depreciation) — review the state-specific adjustment schedule on your return.' },
    { issue: 'Optimization results show a higher liability than expected', solution: 'The optimizer finds the legal minimum — if the result is higher than a hand calculation, the hand calculation may be using an incorrect filing status, missing a phase-out, or claiming a deduction that does not apply. Check the optimization detail log for explanations of each item. Common surprises include AMT (Alternative Minimum Tax) triggered by large state tax deductions, NIIT (Net Investment Income Tax) at 3.8% on investment income above threshold, and SE tax on Schedule C income.' },
  ],

  faq: [
    { q: 'What tax forms does Echo Tax Returns support?', a: 'Individual returns (1040 with all schedules), business returns (1120, 1120-S, 1065), trust and estate returns (1041), nonprofit filings (990), and all common supplemental forms including 8949, 4797, 8829, 2106, and state-specific forms for all 50 states plus DC. Specialty forms like FBAR (FinCEN 114) and FATCA (Form 8938) for international filers are also supported.' },
    { q: 'How secure is my financial data?', a: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Processing occurs on Cloudflare Workers at the edge — your data is never stored on a traditional server. Document uploads are encrypted before storage in sovereign R2 buckets. Access requires multi-factor authentication. The system is designed to meet IRS Publication 1075 safeguard requirements for federal tax information.' },
    { q: 'Can I use Echo Tax Returns for business filings?', a: 'Yes. The platform supports sole proprietorships (Schedule C), S-Corporations (Form 1120-S with K-1 generation), C-Corporations (Form 1120), and partnerships (Form 1065 with K-1 generation). Business features include depreciation tracking, vehicle expense calculation, home office deduction, QBI deduction analysis, and estimated quarterly payment computation.' },
    { q: 'How does the IRC Citation Engine work?', a: 'The citation engine maps every tax position to its authoritative source in the Internal Revenue Code, Treasury Regulations, IRS Revenue Rulings, and relevant Tax Court decisions. When the optimizer recommends a deduction or credit, it includes the specific code section (e.g., IRC §162(a) for ordinary business expenses), the regulatory cite (e.g., Treas. Reg. §1.162-1), and any relevant case law that supports the position. This gives you audit-ready documentation for every line item.' },
    { q: 'What happens if my return gets audited?', a: 'Every position on your return includes the IRC authority that supports it, plus specific documentation recommendations. The audit risk scorecard identifies items most likely to be questioned and lists exactly what records to maintain. If you receive an IRS notice, the system can generate an audit response package with the relevant code sections, calculations, and supporting documentation organized by issue. Pro and Enterprise plans include direct support from our tax resolution team.' },
  ],
}

export default function EchoTaxReturnsDocsPage() {
  return (
    <>
      <FaqSchema faqs={data.faq} name={data.name} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Docs', href: '/docs' },
        { name: data.name, href: '/docs/tax-returns' },
      ]} />
      <ProductDoc {...data} />
    </>
  )
}
