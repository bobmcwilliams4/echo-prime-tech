'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import {
  queryEngine,
  chatEngine,
  getUsage,
  registerUser,
  getPricing,
  getProfile,
  createCheckout,
  openCustomerPortal,
  downloadReport,
  isAuthenticated,
  getStoredUserId,
  getConfidenceColor,
  getConfidenceLabel,
  type QueryResponse,
  type UsageResponse,
  type PricingTier,
  type ProfileResponse,
} from '../../lib/engine-cloud-api';
import {
  queryMultiDomain,
  queryDoctrines,
  getRuntimeStats,
  getConfidenceBadge,
  type DoctrineResult,
  type QueryResponse as RuntimeQueryResponse,
} from '../../lib/engine-runtime-api';
import {
  brainGetContext,
  brainIngest,
  brainSearch,
  sentinelGetContext,
  sentinelStore,
  trinityDecide,
  swarmHealth,
  loadCortexStats,
  detectEmotion,
  buildPersonalityDirective,
  PERSONALITY_PROFILES,
  PERSONALITY_VOICE_MAP,
  type TrinityDecision,
  type CortexStats,
  type DetectedEmotion,
  type PersonalityProfile,
} from '../../lib/sentinel-cloud-api';
import { chatSentinelBrain, checkBrainHealth } from '../../lib/sentinel-brain-api';

// ── Types ──

import {
  classifyQuery as agenticClassify,
  startStreamingSession,
  getDocument as getAgenticDocument,
  cancelSession as cancelAgenticSession,
  type ExecutionPlan,
  type SSECallbacks,
} from '../../lib/agentic-engine-api';
import AgenticProgressPanel, { type AgenticStepDisplay } from '../../components/AgenticProgressPanel';
import DocumentViewer from '../../components/DocumentViewer';

type SentinelMode = 'standard' | 'swarm' | 'echo_prime';
type AnalysisMode = 'FAST' | 'DEFENSE' | 'MEMO';

interface DomainPreset {
  label: string;
  icon: string;
  desc: string;
  domains: string[];
}

const DOMAIN_PRESETS: DomainPreset[] = [
  { label: 'Tax / CPA', icon: '📊', desc: 'Tax planning, compliance, audit defense', domains: ['TX', 'ACCT', 'TXLAW', 'TXRE', 'TXINS', 'FIN', 'INS'] },
  { label: 'Landman / Title', icon: '🗺️', desc: 'Chain of title, mineral rights, oil & gas', domains: ['LAND', 'LG', 'TXRE', 'OILGAS', 'PETRO'] },
  { label: 'Cybersecurity', icon: '🔒', desc: 'Threats, pentesting, forensics, compliance', domains: ['CYBER', 'MALWARE', 'PENTEST', 'REVENG', 'DFIR', 'NET', 'INTELL'] },
  { label: 'Engineering', icon: '⚙️', desc: 'Mechanical, structural, materials, welding', domains: ['MECH', 'AERO', 'CHEM', 'CONST', 'MAT', 'PIPE', 'STEEL', 'WELD', 'EE'] },
  { label: 'Legal', icon: '⚖️', desc: 'Business law, contracts, compliance', domains: ['LG', 'TXLAW', 'BIZ', 'ENT', 'COMP'] },
  { label: 'Medical / Health', icon: '🏥', desc: 'Clinical, research, compliance', domains: ['MED', 'NEURO', 'PSY', 'PHARMA', 'BIOMED'] },
  { label: 'Software / AI', icon: '💻', desc: 'Architecture, DevOps, ML, testing', domains: ['PROG', 'WEBAPP', 'DEVOPS', 'AIML', 'CLOUD', 'MOBILE', 'TEST'] },
  { label: 'Finance', icon: '💰', desc: 'Markets, valuation, strategy, commerce', domains: ['FIN', 'BIZ', 'DCOM', 'SAAS', 'ECOMM', 'ENT'] },
  { label: 'All Domains', icon: '🌐', desc: 'Search all 210 domains', domains: [] },
];

// ── Domain-Specific Intake Questionnaires ──
interface IntakeField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
}

interface DomainIntake {
  title: string;
  subtitle: string;
  fields: IntakeField[];
}

const DOMAIN_INTAKE_FORMS: Record<string, DomainIntake> = {
  'Tax / CPA': {
    title: 'Tax & Accounting Analysis',
    subtitle: 'The more details you provide, the more accurate and actionable your analysis will be',
    fields: [
      { key: 'entityType', label: 'Entity Type', type: 'select', required: true, options: [
        { value: '', label: 'Select entity type' },
        { value: 'individual', label: 'Individual (Single Filer)' },
        { value: 'married_joint', label: 'Married Filing Jointly' },
        { value: 'married_separate', label: 'Married Filing Separately' },
        { value: 'head_of_household', label: 'Head of Household' },
        { value: 'partnership', label: 'Partnership / LLC (Multi-Member)' },
        { value: 'smllc', label: 'Single-Member LLC (Disregarded)' },
        { value: 's_corp', label: 'S-Corporation' },
        { value: 'c_corp', label: 'C-Corporation' },
        { value: 'trust_revocable', label: 'Revocable Trust (Grantor)' },
        { value: 'trust_irrevocable', label: 'Irrevocable Trust' },
        { value: 'estate', label: 'Estate' },
        { value: 'nonprofit_501c3', label: 'Nonprofit 501(c)(3)' },
        { value: 'nonprofit_other', label: 'Nonprofit (Other Exempt)' },
        { value: 'foreign', label: 'Foreign Entity / NRA' },
      ]},
      { key: 'taxYear', label: 'Tax Year(s)', type: 'text', placeholder: 'e.g. 2025, or 2022-2025 for multi-year', required: true },
      { key: 'filingStatus', label: 'Filing Purpose', type: 'select', required: true, options: [
        { value: '', label: 'What do you need help with?' },
        { value: 'planning', label: 'Tax Planning / Strategy' },
        { value: 'return_prep', label: 'Tax Return Preparation' },
        { value: 'audit_defense', label: 'IRS Audit Defense' },
        { value: 'state_audit', label: 'State Tax Audit' },
        { value: 'amendment', label: 'Amended Return / Correction' },
        { value: 'penalty_abatement', label: 'Penalty Abatement / Relief' },
        { value: 'collections', label: 'IRS Collections / OIC' },
        { value: 'entity_structuring', label: 'Entity Structuring / Formation' },
        { value: 'succession', label: 'Succession / Estate Planning' },
        { value: 'international', label: 'International Tax Issues' },
        { value: 'general', label: 'General Tax Question' },
      ]},
      { key: 'state', label: 'State(s) of Filing', type: 'text', placeholder: 'e.g. Texas, California — list all states where you have nexus' },
      { key: 'industry', label: 'Industry / Business Type', type: 'text', placeholder: 'e.g. Oil & Gas, Real Estate, Tech Startup, Restaurant, Medical Practice' },
      { key: 'grossIncome', label: 'Approx. Gross Income / Revenue', type: 'text', placeholder: 'e.g. $250,000 W-2 + $50,000 1099, or $2M business revenue' },
      { key: 'deductions', label: 'Major Deductions / Credits Expected', type: 'textarea', placeholder: 'e.g. Home office, vehicle expenses, depreciation, R&D credit, QBID 199A, IDC, depletion, retirement contributions, charitable donations...', rows: 2 },
      { key: 'lifeEvents', label: 'Recent Life / Business Events', type: 'textarea', placeholder: 'e.g. Sold property, inherited assets, started business, added partners, received stock options, relocated states, divorce, retirement...', rows: 2 },
      { key: 'scenario', label: 'Detailed Tax Question', type: 'textarea', placeholder: 'Describe your specific tax question, planning scenario, audit issue, or situation in as much detail as possible. The more context you provide, the better the analysis...', rows: 4, required: true },
      { key: 'priorPositions', label: 'Prior Tax Positions / Elections', type: 'textarea', placeholder: 'Any existing tax positions, elections (e.g. 754, 338(h)(10)), methods (cash vs accrual), depreciation methods, or strategies already in place...', rows: 2 },
      { key: 'relevantCodes', label: 'Known IRC Sections / Forms', type: 'text', placeholder: 'e.g. IRC 1031, 754, 199A, Form 1065, Schedule K-1, Form 8832' },
      { key: 'priorReturns', label: 'Prior Return Issues', type: 'textarea', placeholder: 'Any issues with prior returns — missed deductions, errors, late filings, prior audit history, NOL carryforwards...', rows: 2 },
      { key: 'advisors', label: 'Current Advisors / Preparers', type: 'text', placeholder: 'e.g. CPA firm name, enrolled agent, self-prepared with TurboTax' },
    ],
  },
  'Cybersecurity': {
    title: 'Cybersecurity Analysis',
    subtitle: 'Specific details about your environment, threats, and objectives produce dramatically better results',
    fields: [
      { key: 'analysisType', label: 'Analysis Type', type: 'select', required: true, options: [
        { value: '', label: 'Select analysis type' },
        { value: 'threat_assessment', label: 'Threat Assessment / Modeling' },
        { value: 'vulnerability', label: 'Vulnerability Analysis' },
        { value: 'incident_response', label: 'Incident Response / Active Breach' },
        { value: 'pentest_planning', label: 'Pentest Planning / Scoping' },
        { value: 'pentest_execution', label: 'Pentest Execution / Methodology' },
        { value: 'compliance_audit', label: 'Compliance Audit / Assessment' },
        { value: 'malware_analysis', label: 'Malware Analysis / Reverse Engineering' },
        { value: 'forensics', label: 'Digital Forensics / Evidence Analysis' },
        { value: 'osint', label: 'OSINT / Reconnaissance' },
        { value: 'network_security', label: 'Network Security / Hardening' },
        { value: 'cloud_security', label: 'Cloud Security Architecture' },
        { value: 'appsec', label: 'Application Security / Code Review' },
        { value: 'red_team', label: 'Red Team Exercise' },
        { value: 'blue_team', label: 'Blue Team / Detection Engineering' },
        { value: 'soc_optimization', label: 'SOC Optimization / Alert Tuning' },
      ]},
      { key: 'environment', label: 'Environment', type: 'select', required: true, options: [
        { value: '', label: 'Select environment' },
        { value: 'aws', label: 'AWS' },
        { value: 'azure', label: 'Azure' },
        { value: 'gcp', label: 'Google Cloud' },
        { value: 'multi_cloud', label: 'Multi-Cloud' },
        { value: 'on_prem', label: 'On-Premises' },
        { value: 'hybrid', label: 'Hybrid (Cloud + On-Prem)' },
        { value: 'iot_ot', label: 'IoT / OT / ICS / SCADA' },
        { value: 'mobile', label: 'Mobile (iOS/Android)' },
        { value: 'web', label: 'Web Application' },
        { value: 'network', label: 'Enterprise Network' },
        { value: 'wireless', label: 'Wireless / Wi-Fi' },
        { value: 'embedded', label: 'Embedded / Firmware' },
      ]},
      { key: 'targetScope', label: 'Target / Scope', type: 'textarea', placeholder: 'IP ranges, domains, application names, network segments, or systems in scope. Be as specific as possible.', rows: 2, required: true },
      { key: 'osAndStack', label: 'OS / Technology Stack', type: 'text', placeholder: 'e.g. Windows Server 2022, Ubuntu 22.04, Kubernetes, NGINX, Apache, IIS' },
      { key: 'framework', label: 'Compliance Framework(s)', type: 'text', placeholder: 'e.g. NIST 800-53, SOC 2 Type II, PCI-DSS 4.0, HIPAA, ISO 27001, CIS Benchmarks' },
      { key: 'currentDefenses', label: 'Current Security Controls', type: 'textarea', placeholder: 'Existing security tools — firewall, EDR, SIEM, MFA, WAF, IDS/IPS, DLP, VPN, PAM, email security, etc.', rows: 2 },
      { key: 'scenario', label: 'Detailed Scenario / Objective', type: 'textarea', placeholder: 'Describe the security scenario, indicators of compromise, vulnerability details, assessment objectives, or threat intelligence in as much detail as possible...', rows: 4, required: true },
      { key: 'indicators', label: 'IOCs / Artifacts', type: 'textarea', placeholder: 'Hashes, IPs, domains, file names, registry keys, log entries, or any suspicious indicators...', rows: 2 },
      { key: 'tools', label: 'Tools / Platforms Available', type: 'text', placeholder: 'e.g. Nmap, Burp Suite, Metasploit, Splunk, ELK, Wireshark, Ghidra, Volatility' },
      { key: 'timeline', label: 'Timeline / Urgency', type: 'text', placeholder: 'e.g. Active incident, scheduled pentest next week, annual audit in 30 days' },
    ],
  },
  'Engineering': {
    title: 'Engineering Analysis',
    subtitle: 'Precise specs, codes, and parameters yield engineering-grade answers',
    fields: [
      { key: 'discipline', label: 'Engineering Discipline', type: 'select', required: true, options: [
        { value: '', label: 'Select discipline' },
        { value: 'mechanical', label: 'Mechanical Engineering' },
        { value: 'structural', label: 'Structural / Civil Engineering' },
        { value: 'electrical', label: 'Electrical / Power Engineering' },
        { value: 'petroleum', label: 'Petroleum / Reservoir Engineering' },
        { value: 'chemical', label: 'Chemical / Process Engineering' },
        { value: 'materials', label: 'Materials Science / Metallurgy' },
        { value: 'welding', label: 'Welding / Fabrication Engineering' },
        { value: 'piping', label: 'Piping / Pressure Vessel Design' },
        { value: 'hvac', label: 'HVAC / Thermal Engineering' },
        { value: 'drilling', label: 'Drilling Engineering' },
        { value: 'completions', label: 'Completions / Frac Engineering' },
        { value: 'nuclear', label: 'Nuclear Engineering' },
        { value: 'aerospace', label: 'Aerospace / Aviation' },
        { value: 'marine', label: 'Marine / Naval Architecture' },
        { value: 'environmental', label: 'Environmental Engineering' },
      ]},
      { key: 'analysisType', label: 'Analysis Type', type: 'select', required: true, options: [
        { value: '', label: 'Select type' },
        { value: 'design', label: 'Design / Sizing Calculation' },
        { value: 'failure', label: 'Failure Analysis / Root Cause' },
        { value: 'optimization', label: 'Optimization / Improvement' },
        { value: 'compliance', label: 'Code Compliance Verification' },
        { value: 'inspection', label: 'Inspection / NDE Interpretation' },
        { value: 'calculation', label: 'Engineering Calculation' },
        { value: 'selection', label: 'Equipment / Material Selection' },
        { value: 'fatigue', label: 'Fatigue / Fracture Analysis' },
        { value: 'thermal', label: 'Thermal / Heat Transfer Analysis' },
        { value: 'flow', label: 'Fluid Flow / Hydraulics' },
        { value: 'fea', label: 'FEA / Stress Analysis Review' },
      ]},
      { key: 'materials', label: 'Materials', type: 'text', placeholder: 'e.g. A516 Gr.70, 316SS, A105, 4130 chrome moly, Inconel 625, 6061-T6 aluminum' },
      { key: 'conditions', label: 'Operating Conditions', type: 'textarea', placeholder: 'Temperature, pressure, flow rate, cycle count, corrosive media, loads, wind/seismic zone, depth...', rows: 2, required: true },
      { key: 'specs', label: 'Dimensions / Specifications', type: 'textarea', placeholder: 'Pipe size, wall thickness, vessel diameter, flange rating, weld joint type, tolerances, surface finish...', rows: 3, required: true },
      { key: 'codes', label: 'Applicable Codes / Standards', type: 'text', placeholder: 'e.g. ASME B31.3, API 650, AWS D1.1, AISC 360, API 5L, NACE MR0175, ASTM specs' },
      { key: 'equipmentInfo', label: 'Equipment / System Details', type: 'textarea', placeholder: 'Equipment type, manufacturer, model, serial number, nameplate data, installation date, service history...', rows: 2 },
      { key: 'scenario', label: 'Problem Description', type: 'textarea', placeholder: 'Describe the engineering problem, design requirement, failure mode, or analysis needed in detail. Include history of the issue if applicable...', rows: 4, required: true },
      { key: 'calculations', label: 'Required Calculations', type: 'textarea', placeholder: 'Specific calculations needed — e.g. MAWP, wall thickness per B31.3, WPS qualification, deflection, buckling, heat duty...', rows: 2 },
      { key: 'attachments', label: 'Reference Documents', type: 'text', placeholder: 'List any P&IDs, drawings, specs, photos, or reports you can reference' },
    ],
  },
  'Legal': {
    title: 'Legal Research & Analysis',
    subtitle: 'Detailed case facts, jurisdiction, and legal context produce far more accurate legal analysis',
    fields: [
      { key: 'areaOfLaw', label: 'Area of Law', type: 'select', required: true, options: [
        { value: '', label: 'What area of law?' },
        { value: 'contract', label: 'Contract / Commercial Law' },
        { value: 'employment', label: 'Employment / Labor Law' },
        { value: 'ip_patent', label: 'Patent / Invention' },
        { value: 'ip_trademark', label: 'Trademark / Trade Dress' },
        { value: 'ip_copyright', label: 'Copyright / Licensing' },
        { value: 'ip_trade_secret', label: 'Trade Secret' },
        { value: 'real_estate', label: 'Real Estate / Property Law' },
        { value: 'oil_gas', label: 'Oil & Gas / Mineral Rights' },
        { value: 'regulatory', label: 'Regulatory / Administrative' },
        { value: 'litigation_civil', label: 'Civil Litigation' },
        { value: 'litigation_commercial', label: 'Commercial Litigation' },
        { value: 'corporate_governance', label: 'Corporate Governance' },
        { value: 'corporate_ma', label: 'M&A / Corporate Transactions' },
        { value: 'corporate_formation', label: 'Entity Formation / Structure' },
        { value: 'bankruptcy_debtor', label: 'Bankruptcy (Debtor Side)' },
        { value: 'bankruptcy_creditor', label: 'Bankruptcy (Creditor Side)' },
        { value: 'environmental', label: 'Environmental Law / NEPA' },
        { value: 'family_divorce', label: 'Divorce / Custody' },
        { value: 'family_estate', label: 'Estate Planning / Probate' },
        { value: 'family_adoption', label: 'Adoption / Guardianship' },
        { value: 'criminal', label: 'Criminal Defense' },
        { value: 'tax_controversy', label: 'Tax Controversy / IRS Dispute' },
        { value: 'insurance', label: 'Insurance Coverage / Bad Faith' },
        { value: 'personal_injury', label: 'Personal Injury / Tort' },
        { value: 'securities', label: 'Securities / SEC Compliance' },
        { value: 'immigration', label: 'Immigration' },
        { value: 'other', label: 'Other / Multi-Area' },
      ]},
      { key: 'jurisdiction', label: 'Jurisdiction / Venue', type: 'text', placeholder: 'e.g. State of Texas, Northern District of Texas, Delaware Chancery, 5th Circuit, Federal', required: true },
      { key: 'posture', label: 'Case Posture / Stage', type: 'select', options: [
        { value: '', label: 'Select stage (if litigation)' },
        { value: 'pre_litigation', label: 'Pre-Litigation / Demand Letter' },
        { value: 'filing', label: 'Complaint / Answer' },
        { value: 'discovery', label: 'Discovery Phase' },
        { value: 'motions', label: 'Dispositive Motions (MSJ/MTD)' },
        { value: 'trial_prep', label: 'Trial Preparation' },
        { value: 'trial', label: 'Trial' },
        { value: 'appeal', label: 'Appeal' },
        { value: 'enforcement', label: 'Judgment Enforcement' },
        { value: 'transactional', label: 'Transactional (Not Litigation)' },
        { value: 'regulatory', label: 'Regulatory Proceeding' },
      ]},
      { key: 'parties', label: 'Parties Involved', type: 'textarea', placeholder: 'Names, roles, and relationships of all parties (plaintiff, defendant, parties to agreement, entities, individuals). Include opposing counsel if known.', rows: 3, required: true },
      { key: 'facts', label: 'Key Facts / Timeline', type: 'textarea', placeholder: 'Chronological facts: dates of events, key communications, actions taken, contracts signed, injuries sustained, amounts at issue. Be thorough — missing facts lead to incomplete analysis.', rows: 5, required: true },
      { key: 'legalIssues', label: 'Specific Legal Issues / Questions', type: 'textarea', placeholder: 'What specific legal questions need answering? e.g. "Does this clause survive termination?", "Is there personal liability for LLC member?", "What is the statute of limitations?", "Does the arbitration clause cover this dispute?"', rows: 4, required: true },
      { key: 'documents', label: 'Key Documents / Evidence', type: 'textarea', placeholder: 'List relevant documents — contracts, leases, emails, text messages, corporate minutes, title documents, medical records, police reports, insurance policies...', rows: 2 },
      { key: 'relevantLaw', label: 'Known Statutes / Case Law / Rules', type: 'textarea', placeholder: 'Any statutes, regulations, case law, or rules you already know are relevant. e.g. UCC Art. 2, Tex. Bus. Org. Code Ch. 21, FRCP 56, Smith v. Jones, Daubert standard...', rows: 2 },
      { key: 'opposingArgs', label: 'Opposing Arguments / Position', type: 'textarea', placeholder: 'What is the other side arguing or likely to argue? What are the weakest points in your position?', rows: 2 },
      { key: 'desiredOutcome', label: 'Desired Outcome', type: 'textarea', placeholder: 'What outcome are you seeking? Damages amount, injunction, contract rescission, compliance pathway, settlement range, legal opinion...', rows: 2 },
      { key: 'timeline', label: 'Key Dates / Deadlines', type: 'text', placeholder: 'e.g. SOL expires March 2026, response due in 14 days, closing date, hearing date' },
      { key: 'budget', label: 'Budget / Practical Constraints', type: 'text', placeholder: 'e.g. Client budget for litigation, insurance coverage limits, relationship preservation priorities' },
    ],
  },
  'Medical / Health': {
    title: 'Medical & Clinical Analysis',
    subtitle: 'Complete clinical context enables differential diagnosis and evidence-based recommendations',
    fields: [
      { key: 'specialty', label: 'Medical Specialty', type: 'select', required: true, options: [
        { value: '', label: 'Select specialty' },
        { value: 'general', label: 'General / Internal Medicine' },
        { value: 'family', label: 'Family Medicine' },
        { value: 'emergency', label: 'Emergency Medicine' },
        { value: 'cardiology', label: 'Cardiology' },
        { value: 'pulmonology', label: 'Pulmonology / Respiratory' },
        { value: 'gastro', label: 'Gastroenterology' },
        { value: 'neurology', label: 'Neurology / Neurosurgery' },
        { value: 'oncology', label: 'Oncology / Hematology' },
        { value: 'orthopedics', label: 'Orthopedics / Sports Medicine' },
        { value: 'dermatology', label: 'Dermatology' },
        { value: 'psychiatry', label: 'Psychiatry / Behavioral Health' },
        { value: 'pediatrics', label: 'Pediatrics' },
        { value: 'obstetrics', label: 'OB/GYN' },
        { value: 'urology', label: 'Urology' },
        { value: 'nephrology', label: 'Nephrology' },
        { value: 'endocrinology', label: 'Endocrinology' },
        { value: 'infectious', label: 'Infectious Disease' },
        { value: 'pharmacology', label: 'Pharmacology / Drug Interactions' },
        { value: 'toxicology', label: 'Toxicology / Poisoning' },
        { value: 'radiology', label: 'Radiology / Imaging' },
        { value: 'pathology', label: 'Pathology / Lab Interpretation' },
        { value: 'anesthesiology', label: 'Anesthesiology / Pain Mgmt' },
        { value: 'surgery', label: 'General Surgery' },
      ]},
      { key: 'purposeType', label: 'Purpose of Inquiry', type: 'select', required: true, options: [
        { value: '', label: 'What do you need?' },
        { value: 'differential', label: 'Differential Diagnosis' },
        { value: 'treatment', label: 'Treatment Planning' },
        { value: 'drug_interaction', label: 'Drug Interaction / Pharmacology' },
        { value: 'lab_interpretation', label: 'Lab / Imaging Interpretation' },
        { value: 'guidelines', label: 'Clinical Guidelines / Protocol' },
        { value: 'research', label: 'Medical Research / Literature' },
        { value: 'compliance', label: 'Medical Compliance / Billing' },
        { value: 'patient_education', label: 'Patient Education' },
        { value: 'second_opinion', label: 'Second Opinion / Review' },
      ]},
      { key: 'patientContext', label: 'Patient Demographics', type: 'textarea', placeholder: 'Age, sex, BMI, ethnicity, relevant social history (smoking, alcohol, occupation, living situation), allergies, immunization status (de-identified)', rows: 2, required: true },
      { key: 'pmh', label: 'Past Medical / Surgical History', type: 'textarea', placeholder: 'Prior diagnoses, surgeries, hospitalizations, chronic conditions, family history of relevant diseases...', rows: 2 },
      { key: 'presentation', label: 'Clinical Presentation', type: 'textarea', placeholder: 'Chief complaint, HPI (onset, duration, quality, severity, timing, aggravating/alleviating factors), review of systems, vital signs, physical exam findings...', rows: 4, required: true },
      { key: 'labResults', label: 'Lab Results / Imaging', type: 'textarea', placeholder: 'CBC, CMP, UA, imaging findings (XR, CT, MRI, US), EKG/ECG, pathology reports, culture results — include values and reference ranges', rows: 3 },
      { key: 'currentMeds', label: 'Current Medications', type: 'textarea', placeholder: 'Full medication list with dosages, frequency, and duration. Include OTC meds, supplements, and herbal remedies.', rows: 3 },
      { key: 'scenario', label: 'Clinical Question', type: 'textarea', placeholder: 'What specific clinical question needs answering? Be as precise as possible — e.g. "Is levofloxacin safe with this patient\'s QTc of 480ms?", "What is the workup for new-onset ascites in a 45yo?", "Treatment algorithm for stage IIIB NSCLC with EGFR mutation?"', rows: 4, required: true },
      { key: 'priorTreatments', label: 'Prior Treatments / Interventions', type: 'textarea', placeholder: 'What has already been tried? Response to prior treatments, failed therapies, adverse reactions...', rows: 2 },
      { key: 'guidelines', label: 'Relevant Guidelines / References', type: 'text', placeholder: 'e.g. AHA/ACC, NCCN, UpToDate, IDSA, WHO, CMS, AGA, AASLD' },
    ],
  },
  'Software / AI': {
    title: 'Software & Architecture Analysis',
    subtitle: 'Stack details, scale requirements, and constraints shape the architectural recommendations',
    fields: [
      { key: 'projectType', label: 'Project Type', type: 'select', required: true, options: [
        { value: '', label: 'Select type' },
        { value: 'web_app', label: 'Web Application (Frontend)' },
        { value: 'full_stack', label: 'Full-Stack Application' },
        { value: 'api', label: 'API / Backend Service' },
        { value: 'mobile_native', label: 'Native Mobile App (iOS/Android)' },
        { value: 'mobile_cross', label: 'Cross-Platform Mobile (React Native/Flutter)' },
        { value: 'ml_pipeline', label: 'ML / AI Pipeline' },
        { value: 'data_pipeline', label: 'Data Engineering / ETL' },
        { value: 'infrastructure', label: 'Infrastructure / DevOps / IaC' },
        { value: 'desktop', label: 'Desktop Application' },
        { value: 'cli', label: 'CLI Tool / SDK' },
        { value: 'microservices', label: 'Microservices Architecture' },
        { value: 'system_design', label: 'System Design Review' },
        { value: 'migration', label: 'Migration / Modernization' },
        { value: 'performance', label: 'Performance Optimization' },
        { value: 'debugging', label: 'Bug Investigation / Debugging' },
      ]},
      { key: 'techStack', label: 'Technology Stack', type: 'textarea', placeholder: 'Languages, frameworks, databases, message queues, cloud services, CI/CD — be specific with versions.\ne.g. TypeScript 5.4, Next.js 15, PostgreSQL 16, Redis, Cloudflare Workers, GitHub Actions', rows: 2, required: true },
      { key: 'scale', label: 'Scale / Performance Requirements', type: 'textarea', placeholder: 'Users (DAU/MAU), requests/second, data volume, latency requirements, uptime SLA, geographic distribution...', rows: 2 },
      { key: 'scenario', label: 'Requirements / Problem Description', type: 'textarea', placeholder: 'Describe what you need to build, the architectural challenge, the bug symptoms, or the optimization target. Include error messages, stack traces, or specific behavior observed...', rows: 5, required: true },
      { key: 'existing', label: 'Current Architecture / Codebase', type: 'textarea', placeholder: 'Current system architecture — services, databases, APIs, deployment topology, monolith vs microservices, existing tech debt, dependency graph...', rows: 3 },
      { key: 'constraints', label: 'Constraints & Requirements', type: 'textarea', placeholder: 'Budget, timeline, compliance (SOC 2, GDPR, HIPAA), team size/skills, vendor lock-in concerns, backward compatibility, offline support, accessibility...', rows: 2 },
      { key: 'errorContext', label: 'Error Messages / Logs', type: 'textarea', placeholder: 'If debugging: paste error messages, stack traces, log output, reproduction steps, environment details...', rows: 3 },
      { key: 'alternatives', label: 'Alternatives Considered', type: 'text', placeholder: 'e.g. Considering Kafka vs RabbitMQ, PostgreSQL vs DynamoDB, monolith vs microservices' },
    ],
  },
  'Finance': {
    title: 'Financial & Business Analysis',
    subtitle: 'Detailed financials, market context, and objectives enable precise business intelligence',
    fields: [
      { key: 'analysisType', label: 'Analysis Type', type: 'select', required: true, options: [
        { value: '', label: 'Select type' },
        { value: 'valuation', label: 'Business Valuation (DCF, Comps, Precedent)' },
        { value: 'investment', label: 'Investment Analysis / Due Diligence' },
        { value: 'risk', label: 'Risk Assessment / Management' },
        { value: 'modeling', label: 'Financial Modeling / Projections' },
        { value: 'strategy', label: 'Business Strategy / Planning' },
        { value: 'ma', label: 'M&A / Deal Analysis' },
        { value: 'market', label: 'Market Research / Competitive Analysis' },
        { value: 'pricing', label: 'Pricing Strategy / Unit Economics' },
        { value: 'fundraising', label: 'Fundraising / Capital Structure' },
        { value: 'restructuring', label: 'Restructuring / Turnaround' },
        { value: 'real_estate', label: 'Real Estate Investment Analysis' },
        { value: 'oil_gas', label: 'Oil & Gas / Energy Economics' },
        { value: 'crypto', label: 'Crypto / Digital Asset Analysis' },
      ]},
      { key: 'industry', label: 'Industry / Sector', type: 'text', placeholder: 'e.g. SaaS B2B, Oil & Gas E&P, Real Estate (Multifamily), E-commerce DTC, Healthcare Services', required: true },
      { key: 'companyStage', label: 'Company Stage', type: 'select', options: [
        { value: '', label: 'Select stage' },
        { value: 'pre_revenue', label: 'Pre-Revenue / Startup' },
        { value: 'early', label: 'Early Stage ($0-$1M revenue)' },
        { value: 'growth', label: 'Growth Stage ($1M-$10M)' },
        { value: 'scale', label: 'Scale-Up ($10M-$100M)' },
        { value: 'mature', label: 'Mature ($100M+)' },
        { value: 'public', label: 'Publicly Traded' },
        { value: 'distressed', label: 'Distressed / Turnaround' },
      ]},
      { key: 'financials', label: 'Key Financial Data', type: 'textarea', placeholder: 'Revenue, EBITDA, gross margin, net income, cash flow, debt levels, cap table, burn rate, runway. Include multiple years if available.', rows: 3, required: true },
      { key: 'scenario', label: 'Analysis Question / Objective', type: 'textarea', placeholder: 'What specific financial analysis do you need? Deal terms to evaluate, valuation question, growth strategy to model, risk to quantify, investment decision to make...', rows: 4, required: true },
      { key: 'metrics', label: 'Key Metrics / KPIs', type: 'textarea', placeholder: 'CAC, LTV, churn rate, NRR, gross margin, ROIC, IRR target, cap rate, NOI, P/E ratio, EV/EBITDA multiples, production decline curve...', rows: 2 },
      { key: 'market', label: 'Market / Competitive Context', type: 'textarea', placeholder: 'Market size (TAM/SAM/SOM), growth rate, key competitors, market position, regulatory environment, barriers to entry...', rows: 2 },
      { key: 'timeline', label: 'Time Horizon / Key Dates', type: 'text', placeholder: 'e.g. 5-year projection, deal closing in 30 days, fundraising Q2 2026, exit in 3-5 years' },
      { key: 'assumptions', label: 'Key Assumptions', type: 'textarea', placeholder: 'Growth rate assumptions, discount rate, terminal value assumptions, market conditions, pricing assumptions, cost structure assumptions...', rows: 2 },
    ],
  },
};

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  confidence?: string;
  sources?: number;
  cost?: number;
  remaining?: number;
  hash?: string;
  reportId?: string;
  reportAvailable?: boolean;
  domain?: string;
  domainCost?: number;
  // Extended metadata
  mode?: SentinelMode;
  trinity?: TrinityDecision;
  emotion?: DetectedEmotion;
  personality?: PersonalityProfile;
  voiceId?: string;
  // Engine doctrine results
  doctrineResults?: DoctrineResult[];
  domainsQueried?: string[];
}

// ── Working Panel Data ──
const ECHO_FACTS: { icon: string; text: string; category: string }[] = [
  { icon: '🧠', text: 'Echo Prime runs 2,632 doctrine-hardened engines across 210 knowledge domains', category: 'Architecture' },
  { icon: '⚡', text: 'Each query checks over 202,000 pre-compiled doctrine blocks in under 200ms', category: 'Speed' },
  { icon: '🔒', text: 'Every response includes a SHA-256 determinism hash for court-defensible audit trails', category: 'Security' },
  { icon: '🏛️', text: 'The Tax Intelligence Engine (TIE) contains 10,918 lines of pure tax law logic — no hallucination possible', category: 'Tax' },
  { icon: '⛽', text: 'In 1901, the Spindletop well in Beaumont, TX produced 100,000 barrels per day — launching the oil age', category: 'Oil & Gas' },
  { icon: '📜', text: 'A "chain of title" traces every deed, will, and conveyance from sovereign patent to present day owner', category: 'Landman' },
  { icon: '🤖', text: 'Trinity Council mode uses 3 independent AI models that vote on answers — consensus prevents errors', category: 'Swarm' },
  { icon: '🗺️', text: 'Texas has 254 counties — more than any other US state. Echo Prime covers 80+ with live portal access', category: 'Texas' },
  { icon: '💎', text: 'Mineral rights in Texas can be severed from surface rights — creating two separate estates', category: 'Landman' },
  { icon: '📊', text: 'The Permian Basin produces over 6 million barrels of oil per day — 40% of all US production', category: 'Oil & Gas' },
  { icon: '🔍', text: 'A title examiner may review 100+ years of records to certify ownership of a single tract', category: 'Landman' },
  { icon: '⚖️', text: 'IRC §1031 like-kind exchanges let investors defer capital gains tax by swapping properties', category: 'Tax' },
  { icon: '🌐', text: 'Echo Prime\'s Shared Brain stores every interaction — knowledge compounds across all sessions', category: 'Memory' },
  { icon: '🏗️', text: 'The H&GN Railroad Survey system divided West Texas into numbered sections and blocks in the 1880s', category: 'Landman' },
  { icon: '🛡️', text: 'Our engines detect 47 types of disguised sale transactions that the IRS frequently challenges', category: 'Tax' },
  { icon: '🎯', text: 'Echo Prime processes queries through a 3-layer pipeline: Doctrine Cache → Semantic Search → Deep Analysis', category: 'Architecture' },
  { icon: '📈', text: 'The first Texas oil well was drilled near Nacogdoches in 1866 — 35 years before Spindletop', category: 'Oil & Gas' },
  { icon: '🔬', text: 'Fact Fragility Scoring rates each assertion on verifiability, recharacterization risk, and testimony dependence', category: 'Security' },
  { icon: '🏠', text: 'Texas homestead law protects up to 200 acres of rural land and 10 acres of urban land from creditors', category: 'Texas' },
  { icon: '⏱️', text: 'Average Sentinel query resolves in 5-12 seconds — a human expert would need 2-4 hours for equivalent analysis', category: 'Speed' },
];

const WORKING_STEPS: Record<string, { label: string; icon: string }[]> = {
  standard: [
    { label: 'Initializing doctrine engines', icon: '⚙️' },
    { label: 'Loading memory context', icon: '🧠' },
    { label: 'Scanning knowledge domains', icon: '🔍' },
    { label: 'Matching doctrine blocks', icon: '📚' },
    { label: 'Running semantic analysis', icon: '🔬' },
    { label: 'Cross-referencing authorities', icon: '⚖️' },
    { label: 'Computing confidence scores', icon: '📊' },
    { label: 'Generating determinism hash', icon: '🔒' },
    { label: 'Composing response', icon: '✍️' },
    { label: 'Finalizing...', icon: '✅' },
  ],
  swarm: [
    { label: 'Assembling Trinity Council', icon: '👥' },
    { label: 'Injecting memory context', icon: '🧠' },
    { label: 'Enriching with doctrines', icon: '📚' },
    { label: 'SAGE is analyzing...', icon: '🦉' },
    { label: 'NYX is deliberating...', icon: '🌙' },
    { label: 'THORNE is evaluating...', icon: '🗡️' },
    { label: 'Collecting votes', icon: '🗳️' },
    { label: 'Computing consensus', icon: '🤝' },
    { label: 'Measuring harmony level', icon: '📐' },
    { label: 'Synthesizing reasoning', icon: '💡' },
    { label: 'Calculating confidence', icon: '📊' },
    { label: 'Rendering verdict', icon: '⚖️' },
    { label: 'Finalizing...', icon: '✅' },
  ],
  echo_prime: [
    { label: 'Loading personality profile', icon: '🎭' },
    { label: 'Detecting emotional context', icon: '💭' },
    { label: 'Retrieving memory cortex', icon: '🧠' },
    { label: 'Building cognitive directive', icon: '📋' },
    { label: 'Enriching with doctrine engines', icon: '📚' },
    { label: 'Routing to optimal LLM', icon: '🤖' },
    { label: 'Generating adaptive response', icon: '✨' },
    { label: 'Storing to Shared Brain', icon: '💾' },
    { label: 'Composing voice output', icon: '🎤' },
    { label: 'Finalizing...', icon: '✅' },
  ],
};

// ── Sentinel Instance ID (stable to avoid hydration mismatch) ──
const SENTINEL_INSTANCE = 'sentinel_web_ept';

// ── Component ──

export default function SentinelPage() {
  const { user, role } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('FAST');
  const [sentinelMode, setSentinelMode] = useState<SentinelMode>('standard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [cortexStats, setCortexStats] = useState<CortexStats | null>(null);
  const [memoryPanelOpen, setMemoryPanelOpen] = useState(false);
  const [memorySearch, setMemorySearch] = useState('');
  const [memoryResults, setMemoryResults] = useState<{ content: string; timestamp: string }[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [personality, setPersonality] = useState<string>('EP');
  const [showPersonalities, setShowPersonalities] = useState(false);
  const [swarmOnline, setSwarmOnline] = useState(false);
  const [commanderMode, setCommanderMode] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [showDomainSelector, setShowDomainSelector] = useState(false);
  const [showDoctrineDetail, setShowDoctrineDetail] = useState<string | null>(null);
  // ── Agentic Mode State ──
  const [agenticMode, setAgenticMode] = useState(false);
  const [agenticSession, setAgenticSession] = useState<string | null>(null);
  const [agenticSteps, setAgenticSteps] = useState<AgenticStepDisplay[]>([]);
  const [agenticPlan, setAgenticPlan] = useState<ExecutionPlan | null>(null);
  const [agenticStatus, setAgenticStatus] = useState<string>('idle');
  const [agenticElapsed, setAgenticElapsed] = useState(0);
  const [agenticDocument, setAgenticDocument] = useState<string | null>(null);
  const [agenticAbort, setAgenticAbort] = useState<(() => void) | null>(null);
  const agenticTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // ── Domain Intake Form ──
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [intakeFormDomain, setIntakeFormDomain] = useState<string>('');
  const [intakeData, setIntakeData] = useState<Record<string, string>>({
    state: 'Texas',
    county: '',
    section: '',
    block: '',
    lots: '',
    survey: '',
    currentOwners: '',
    previousOwners: '',
    notes: '',
  });
  const agenticStartTimeRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  // ── Working Panel State ──
  const [loadingElapsed, setLoadingElapsed] = useState(0);
  const [loadingFactIndex, setLoadingFactIndex] = useState(0);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const loadingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loadingFactTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Auth check ──
  useEffect(() => {
    const hasKey = isAuthenticated();
    setApiKeyReady(hasKey);
    if (!hasKey) setShowSetup(true);
  }, []);

  // ── Load usage + profile ──
  useEffect(() => {
    if (apiKeyReady) {
      getUsage().then(setUsage).catch(() => {});
      getProfile().then(setProfile).catch(() => {});
    }
  }, [apiKeyReady]);

  // ── Commander detection ──
  useEffect(() => {
    if (role === 'owner') {
      setCommanderMode(true);
    }
  }, [user]);

  // ── Cortex stats ──
  useEffect(() => {
    if (apiKeyReady) {
      const playerId = getStoredUserId() || 'anon';
      loadCortexStats(playerId).then(setCortexStats).catch(() => {});
    }
  }, [apiKeyReady]);

  // ── Swarm health ──
  useEffect(() => {
    swarmHealth().then(h => setSwarmOnline(h.status === 'ok' || h.trinity_available)).catch(() => {});
  }, []);

  // ── Stripe upgrade return ──
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('upgraded') === 'true') {
        setTimeout(() => {
          getProfile().then(setProfile).catch(() => {});
          getUsage().then(setUsage).catch(() => {});
        }, 2000);
        setMessages(prev => [...prev, { id: `upgrade_${Date.now()}`, role: 'system', content: 'Subscription activated! Your plan has been upgraded.', timestamp: Date.now() }]);
        window.history.replaceState({}, '', '/sentinel');
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load pricing ──
  useEffect(() => {
    getPricing().then(p => setPricingTiers(p.tiers)).catch(() => {});
  }, []);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Welcome ──
  useEffect(() => {
    if (apiKeyReady && messages.length === 0) {
      setMessages([{
        id: 'welcome', role: 'system', timestamp: Date.now(),
        content: commanderMode
          ? 'COMMANDER MODE ACTIVE. Authority 11.0. Unlimited queries. All engines unlocked.\n\n2,632 engines. 210 domains. 186K+ doctrine blocks. Standard, Swarm, and Echo Prime modes online.\nDomain selector active. Memory cortex connected. Voice output available.'
          : 'Sentinel Intelligence Engine online. 2,632 engines. 210 domains. 186K+ doctrine blocks. Zero hallucination.\n\nThis AI is court-defensible — every response grounded in pre-compiled doctrine blocks with deterministic hashing.\n\nSelect your domain in the sidebar (Tax/CPA, Landman, Engineering, Legal, Medical, Cybersecurity, etc.) for targeted engine intelligence. Or ask anything across all 210 domains.\n\nModes: Standard (doctrine), Swarm (Trinity Council), Echo Prime (personality + memory).',
      }]);
    }
  }, [apiKeyReady, commanderMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-register ──
  const handleAutoRegister = useCallback(async () => {
    if (!user?.email) return;
    try {
      await registerUser(user.email, user.displayName || undefined);
      setApiKeyReady(true);
      setShowSetup(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('UNIQUE constraint')) {
        setMessages(prev => [...prev, { id: `err_${Date.now()}`, role: 'system', content: 'Email already registered. Contact support@echo-ept.com for a key reset.', timestamp: Date.now() }]);
      }
    }
  }, [user]);

  // ── Voice playback via ElevenLabs v3 (routed through echo-chat worker) ──
  // Emotion-to-audio-tag mapping for ElevenLabs v3 expressive TTS
  const emotionAudioTag = useCallback((emotion: string): string => {
    const tags: Record<string, string> = {
      joy: '[laughs]', fear: '[nervous]', anger: '[angry]', sadness: '[sighs]',
      surprise: '[gasps]', concern: '[sighs]', pride: '[excited]',
      frustration: '[sighs]', curiosity: '[curious]', trust: '', anticipation: '[curious]',
    };
    return tags[emotion] || '';
  }, []);

  const playVoice = useCallback(async (text: string, voice: string, emotion?: string) => {
    try {
      // Strip markdown for cleaner spoken output
      const cleanText = text
        .replace(/#{1,6}\s/g, '')
        .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^[-*]\s/gm, '')
        .replace(/\n{2,}/g, '. ')
        .replace(/---/g, '')
        .slice(0, 2500);

      // Inject emotion audio tag for ElevenLabs v3 expressiveness
      const emotionTag = emotion ? emotionAudioTag(emotion) : '';
      const ttsText = emotionTag ? `${emotionTag} ${cleanText}` : cleanText;

      // Map sentinel personality voice names → echo-chat personality IDs
      const voiceToPersonality: Record<string, string> = {
        echo_prime: 'EP', commander: 'EP', bree: 'BR', thorne: 'SA',
        sage: 'EP', phoenix: 'PH', prometheus: 'PR',
      };
      const personalityId = voiceToPersonality[voice] || 'EP';

      // Route through echo-chat worker with ElevenLabs provider
      const res = await fetch('https://echo-chat.bmcii1976.workers.dev/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: ttsText,
          personality: personalityId,
          emotion: emotion || 'neutral',
          provider: 'elevenlabs',
        }),
      });
      if (!res.ok) {
        // Fallback to Echo Speak local TTS if ElevenLabs fails
        const fallbackRes = await fetch('https://tts.echo-op.com/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanText, voice_id: voice || 'default', output_format: 'wav' }),
        });
        if (!fallbackRes.ok) return;
        const blob = await fallbackRes.blob();
        const url = URL.createObjectURL(blob);
        if (audioRef.current) { audioRef.current.src = url; audioRef.current.play().catch(() => {}); }
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(() => {});
      }
    } catch { /* non-critical — TTS failure should never block UI */ }
  }, [emotionAudioTag]);

  // ── Memory search ──
  const handleMemorySearch = useCallback(async () => {
    if (!memorySearch.trim()) return;
    try {
      const res = await brainSearch(memorySearch, 10);
      setMemoryResults((res?.results || []).map(r => ({ content: r.content, timestamp: r.timestamp })));
    } catch {
      setMemoryResults([]);
    }
  }, [memorySearch]);

  // ── Start Agentic Analysis from Intake Form ──
  const startIntakeAnalysis = useCallback(async () => {
    const d = intakeData;
    if (!d.county || !d.section || !d.block) return;

    // Build structured query from intake fields
    const parts: string[] = ['Chain of title for'];
    if (d.lots) parts.push(`Lots ${d.lots},`);
    parts.push(`Block ${d.block},`);
    parts.push(`Section ${d.section},`);
    if (d.survey) parts.push(`${d.survey} Survey,`);
    parts.push(`${d.county} County, ${d.state}`);
    const text = parts.join(' ');

    // Build known owners list for orchestrator
    const knownOwners: string[] = [];
    if (d.currentOwners.trim()) knownOwners.push(...d.currentOwners.split('\n').map(s => s.trim()).filter(Boolean));
    if (d.previousOwners.trim()) knownOwners.push(...d.previousOwners.split('\n').map(s => s.trim()).filter(Boolean));

    setShowIntakeForm(false);
    setInput(text);

    // Add user message to chat
    const summaryParts = [`**Chain of Title Analysis**`, `Section ${d.section}, Block ${d.block}${d.lots ? `, Lots ${d.lots}` : ''}`];
    if (d.survey) summaryParts.push(`${d.survey} Survey`);
    summaryParts.push(`${d.county} County, ${d.state}`);
    if (knownOwners.length > 0) summaryParts.push(`Known owners: ${knownOwners.join(', ')}`);
    if (d.notes) summaryParts.push(`Notes: ${d.notes}`);

    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', content: summaryParts.join('\n'), timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Enter agentic mode
    setAgenticMode(true);
    setAgenticSession(null);
    setAgenticSteps([]);
    setAgenticPlan(null);
    setAgenticStatus('planning');
    setAgenticElapsed(0);
    setAgenticDocument(null);
    agenticStartTimeRef.current = Date.now();

    if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
    agenticTimerRef.current = setInterval(() => {
      setAgenticElapsed(Date.now() - agenticStartTimeRef.current);
    }, 500);

    const callbacks: SSECallbacks = {
      onPlan: (plan) => { setAgenticPlan(plan); setAgenticStatus('executing'); setAgenticSteps(plan.steps.map(s => ({ id: s.id, name: s.name, type: s.type as AgenticStepDisplay['type'], status: 'pending', duration_ms: 0 }))); },
      onStepStart: (step) => { setAgenticSteps(prev => prev.map(s => s.id === step.step_id ? { ...s, status: 'running' } : s)); },
      onStepComplete: (step) => { setAgenticSteps(prev => prev.map(s => s.id === step.step_id ? { ...s, status: 'complete', duration_ms: step.duration_ms, summary: step.summary } : s)); },
      onStepFailed: (step) => { setAgenticSteps(prev => prev.map(s => s.id === step.step_id ? { ...s, status: 'failed', error: step.error } : s)); },
      onValidation: () => { setAgenticStatus('validating'); },
      onDocumentReady: async (data) => {
        setAgenticStatus('complete');
        if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
        try { const html = await getAgenticDocument(data.session_id); setAgenticDocument(html); } catch { /* retry */ }
      },
      onError: (error) => { setAgenticStatus('failed'); if (agenticTimerRef.current) clearInterval(agenticTimerRef.current); setMessages(prev => [...prev, { id: `e_${Date.now()}`, role: 'system', content: `Agentic analysis failed: ${error}`, timestamp: Date.now() }]); },
      onDone: (data) => { setAgenticSession(data.session_id); if (data.status === 'complete') setAgenticStatus('complete'); else if (data.status === 'failed') setAgenticStatus('failed'); if (agenticTimerRef.current) clearInterval(agenticTimerRef.current); },
    };

    try {
      const { sessionPromise, abort } = startStreamingSession(
        text,
        selectedDomains,
        callbacks,
        { known_owners: knownOwners, notes: d.notes, property: { state: d.state, county: d.county, section: d.section, block: d.block, lots: d.lots, survey: d.survey } },
      );
      setAgenticAbort(() => abort);
      const sessionId = await sessionPromise;
      setAgenticSession(sessionId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (!msg.includes('aborted')) {
        setAgenticStatus('failed');
        if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
        setMessages(prev => [...prev, { id: `e_${Date.now()}`, role: 'system', content: `Agentic session failed: ${msg}`, timestamp: Date.now() }]);
      }
    }
  }, [intakeData, loading, apiKeyReady, selectedDomains]);

  // ── Start Agentic Deep Analysis (freeform fallback) ──
  const startAgenticAnalysis = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !apiKeyReady) return;

    // Add user message to chat
    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Enter agentic mode
    setAgenticMode(true);
    setAgenticSession(null);
    setAgenticSteps([]);
    setAgenticPlan(null);
    setAgenticStatus('planning');
    setAgenticElapsed(0);
    setAgenticDocument(null);
    agenticStartTimeRef.current = Date.now();

    // Start elapsed timer
    if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
    agenticTimerRef.current = setInterval(() => {
      setAgenticElapsed(Date.now() - agenticStartTimeRef.current);
    }, 500);

    const callbacks: SSECallbacks = {
      onPlan: (plan) => {
        setAgenticPlan(plan);
        setAgenticStatus('executing');
        // Initialize steps from plan
        setAgenticSteps(plan.steps.map(s => ({
          id: s.id,
          name: s.name,
          type: s.type as AgenticStepDisplay['type'],
          status: 'pending',
          duration_ms: 0,
        })));
      },
      onStepStart: (step) => {
        setAgenticSteps(prev => prev.map(s =>
          s.id === step.step_id ? { ...s, status: 'running' } : s
        ));
      },
      onStepComplete: (step) => {
        setAgenticSteps(prev => prev.map(s =>
          s.id === step.step_id ? { ...s, status: 'complete', duration_ms: step.duration_ms, summary: step.summary } : s
        ));
      },
      onStepFailed: (step) => {
        setAgenticSteps(prev => prev.map(s =>
          s.id === step.step_id ? { ...s, status: 'failed', error: step.error } : s
        ));
      },
      onValidation: () => {
        setAgenticStatus('validating');
      },
      onDocumentReady: async (data) => {
        setAgenticStatus('complete');
        if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
        try {
          const html = await getAgenticDocument(data.session_id);
          setAgenticDocument(html);
        } catch { /* document fetch failed — user can retry */ }
      },
      onError: (error) => {
        setAgenticStatus('failed');
        if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
        setMessages(prev => [...prev, { id: `e_${Date.now()}`, role: 'system', content: `Agentic analysis failed: ${error}`, timestamp: Date.now() }]);
      },
      onDone: (data) => {
        setAgenticSession(data.session_id);
        if (data.status === 'complete') {
          setAgenticStatus('complete');
        } else if (data.status === 'failed') {
          setAgenticStatus('failed');
        }
        if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
      },
    };

    try {
      const { sessionPromise, abort } = startStreamingSession(text, selectedDomains, callbacks);
      setAgenticAbort(() => abort);
      const sessionId = await sessionPromise;
      setAgenticSession(sessionId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (!msg.includes('aborted')) {
        setAgenticStatus('failed');
        if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
        setMessages(prev => [...prev, { id: `e_${Date.now()}`, role: 'system', content: `Agentic session failed: ${msg}`, timestamp: Date.now() }]);
      }
    }
  }, [input, loading, apiKeyReady, selectedDomains]);

  const cancelAgentic = useCallback(() => {
    if (agenticAbort) agenticAbort();
    if (agenticSession) cancelAgenticSession(agenticSession).catch(() => {});
    setAgenticStatus('cancelled');
    if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
  }, [agenticAbort, agenticSession]);

  const closeAgenticMode = useCallback(() => {
    setAgenticMode(false);
    setAgenticDocument(null);
    setAgenticSteps([]);
    setAgenticPlan(null);
    setAgenticStatus('idle');
    setAgenticSession(null);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (agenticTimerRef.current) clearInterval(agenticTimerRef.current);
    };
  }, []);

  // ── Working Panel Timer ──
  useEffect(() => {
    if (loading) {
      setLoadingElapsed(0);
      setLoadingStepIndex(0);
      setLoadingFactIndex(Math.floor(Math.random() * ECHO_FACTS.length));
      loadingTimerRef.current = setInterval(() => {
        setLoadingElapsed(prev => prev + 1);
        setLoadingStepIndex(prev => {
          const steps = WORKING_STEPS[sentinelMode] || WORKING_STEPS.standard;
          return prev < steps.length - 1 ? prev + 1 : prev;
        });
      }, 1000);
      loadingFactTimerRef.current = setInterval(() => {
        setLoadingFactIndex(prev => (prev + 1) % ECHO_FACTS.length);
      }, 6000);
    } else {
      if (loadingTimerRef.current) { clearInterval(loadingTimerRef.current); loadingTimerRef.current = null; }
      if (loadingFactTimerRef.current) { clearInterval(loadingFactTimerRef.current); loadingFactTimerRef.current = null; }
    }
    return () => {
      if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
      if (loadingFactTimerRef.current) clearInterval(loadingFactTimerRef.current);
    };
  }, [loading, sentinelMode]);

  // ── Send message ──
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !apiKeyReady) return;

    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const emotion = detectEmotion(text);
    const activeProfile = PERSONALITY_PROFILES[personality];
    const voiceId = PERSONALITY_VOICE_MAP[personality] || 'echo_prime';

    try {
      let assistantMsg: Message;

      // ── Domain-specific doctrine query (runs for ALL modes when domains selected) ──
      let doctrineResults: DoctrineResult[] = [];
      let domainsQueried: string[] = [];
      if (selectedDomains.length > 0) {
        try {
          const docRes = await queryMultiDomain(text, selectedDomains, 5);
          if (docRes.ok && docRes.results?.length > 0) {
            doctrineResults = docRes.results;
            domainsQueried = selectedDomains;
          }
        } catch { /* doctrine enrichment is additive — proceed without */ }
      } else {
        // No preset selected — do cross-domain search to auto-detect relevant domains
        try {
          const docRes = await queryDoctrines(text, undefined, 3);
          if (docRes.ok && docRes.results?.length > 0) {
            doctrineResults = docRes.results;
            domainsQueried = [...new Set(docRes.results.map(r => r.domain))];
          }
        } catch { /* proceed without */ }
      }

      // Build doctrine context string for injection into all modes
      const doctrineContext = doctrineResults.length > 0
        ? `\n\n[DOCTRINE ENGINE RESULTS — ${domainsQueried.join(', ')}]:\n` +
          doctrineResults.slice(0, 3).map(d =>
            `• ${d.topic} (${d.confidence}, ${d.domain}): ${d.conclusion.slice(0, 300)}`
          ).join('\n')
        : '';

      if (sentinelMode === 'swarm') {
        // ── Swarm Mode: Trinity Council + Memory + Doctrine ──
        let memoryContext = '';
        try {
          const ctx = await brainGetContext(SENTINEL_INSTANCE, text);
          if (ctx.context_window) memoryContext = ctx.context_window;
          if (cortexStats) setCortexStats({ ...cortexStats, contextInjected: true });
        } catch { /* proceed without memory */ }

        const queryWithContext = [
          '[INSTRUCTION: Provide a concise consensus — 2-4 sentences max. Be direct and decisive. Only state facts from the DOCTRINE RESULTS below or general knowledge. Never fabricate documents or specifications. If asked to reproduce a specific document, say you do not have it.]',
          memoryContext ? `[MEMORY CONTEXT: ${memoryContext.slice(0, 500)}]` : '',
          doctrineContext,
          text,
        ].filter(Boolean).join('\n\n');
        const decision = await trinityDecide(queryWithContext);
        // Truncate long reasoning to keep responses punchy
        const rawResponse = decision?.reasoning_synthesis || decision?.consensus || 'Trinity Council returned no consensus. Try rephrasing your question.';
        const responseContent = rawResponse.length > 800 ? rawResponse.slice(0, 800) + '...' : rawResponse;

        assistantMsg = {
          id: `a_${Date.now()}`, role: 'assistant', timestamp: Date.now(),
          content: responseContent,
          mode: 'swarm',
          trinity: decision,
          emotion,
          voiceId,
          doctrineResults: doctrineResults.length > 0 ? doctrineResults : undefined,
          domainsQueried: domainsQueried.length > 0 ? domainsQueried : undefined,
        };

        // Store swarm response to memory
        brainIngest(SENTINEL_INSTANCE, `Q: ${text}\nA [SWARM]: ${(responseContent || '').slice(0, 500)}`, 6, ['sentinel', 'swarm', 'trinity']).catch(() => {});
      } else if (sentinelMode === 'echo_prime') {
        // ── Echo Prime Mode: Personality + Memory + Doctrine + LLM Chat ──
        const personalityDirective = buildPersonalityDirective(activeProfile, emotion);

        // Inject memory context
        let memoryContext = '';
        try {
          const ctx = await brainGetContext(SENTINEL_INSTANCE, text);
          if (ctx.context_window) memoryContext = ctx.context_window;
          if (cortexStats) setCortexStats({ ...cortexStats, contextInjected: true });
        } catch { /* proceed without memory */ }

        // Build system prompt: personality + memory + doctrine context
        const systemPrompt = [
          personalityDirective,
          memoryContext ? `\n\n[MEMORY CONTEXT — previous interactions with this user]:\n${memoryContext.slice(0, 800)}` : '',
          doctrineContext,
          `\n\n[RESPONSE RULES — MANDATORY]:
1. Keep responses CONCISE — 2-4 sentences max for simple questions, 1-2 short paragraphs for complex ones.
2. Lead with the answer, not the preamble.
3. Write for VOICE — short punchy sentences. No bullet lists, no markdown headers, no numbered lists.
4. When citing doctrine, weave it naturally into conversation. Never dump raw citations.
5. Sound like a brilliant expert talking to a friend — warm, direct, authoritative.
6. If the answer is simple, give a simple answer. Do NOT pad with unnecessary context.

[CAPABILITIES]:
7. You are Sentinel AI on echo-ept.com, powered by Claude Opus 4.6 via the ECHO PRIME infrastructure. You have access to the ECHO OMEGA PRIME network including 4 compute nodes (ALPHA, BRAVO, CHARLIE, DELTA), 2,632 knowledge engines with 202,751 doctrines across 210 domain categories, and 7.17 million lines of domain intelligence.
8. ONLY state facts that appear in the DOCTRINE ENGINE RESULTS above or in your training data. If no doctrine results were provided for this query, say "I don't have specific doctrine data on that topic" and offer general knowledge instead.
9. NEVER fabricate documents, plans, configurations, code, or technical specifications you haven't been given.
10. If asked to analyze yourself, describe your capabilities honestly: Claude Opus 4.6 with doctrine grounding from 2,632 knowledge engines across 210 domains.`,
        ].filter(Boolean).join('');

        // Build conversation history for context continuity
        const history = messages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .slice(-6)
          .map(m => ({ role: m.role, content: m.content.slice(0, 1000) }));

        // Route through Claude Opus 4.6 brain (primary) with GPT-4.1 fallback
        let responseText = '';
        let usedModel = 'claude-opus-4-6';
        try {
          const brainResult = await chatSentinelBrain(text, systemPrompt, history, (status) => {
            // Update UI with processing status
            if (status === 'processing') {
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && last.content === '...thinking...') return prev;
                return [...prev, { id: `thinking_${Date.now()}`, role: 'assistant' as const, timestamp: Date.now(), content: '...thinking...', mode: 'echo_prime' }];
              });
            }
          });
          responseText = brainResult.response;
          usedModel = brainResult.model;
          // Remove thinking indicator
          setMessages(prev => prev.filter(m => !m.id.startsWith('thinking_')));
        } catch {
          // Fallback to Azure GPT-4.1 if brain is offline
          usedModel = 'gpt-4.1-fallback';
          const fallback = await chatEngine(text, systemPrompt, history);
          responseText = fallback.response;
        }

        assistantMsg = {
          id: `a_${Date.now()}`, role: 'assistant', timestamp: Date.now(),
          content: responseText,
          confidence: 'DISCLOSURE',
          sources: doctrineResults.length > 0 ? doctrineResults.length : 0,
          cost: 0,
          remaining: 999999,
          domain: domainsQueried.length > 0 ? domainsQueried.join(' + ') : `Echo Prime (${usedModel})`,
          mode: 'echo_prime',
          emotion,
          personality: activeProfile,
          voiceId,
          doctrineResults: doctrineResults.length > 0 ? doctrineResults : undefined,
          domainsQueried: domainsQueried.length > 0 ? domainsQueried : undefined,
        };

        // Store to memory
        brainIngest(SENTINEL_INSTANCE, `Q: ${text}\nA [ECHO_PRIME/${usedModel}]: ${(responseText || '').slice(0, 500)}`, 5, ['sentinel', 'echo_prime', 'personality']).catch(() => {});
      } else {
        // ── Standard Mode: Direct engine query + Memory + Doctrine ──
        let memoryContext = '';
        try {
          const ctx = await brainGetContext(SENTINEL_INSTANCE, text);
          if (ctx.context_window) memoryContext = ctx.context_window;
          if (cortexStats) setCortexStats({ ...cortexStats, contextInjected: true });
        } catch { /* proceed without memory */ }

        const queryPrefix = '[INSTRUCTION: Give a concise, direct answer. 2-4 sentences for simple questions. Lead with the answer. You are a cloud-based AI — never claim local drive or file access. Only state facts from doctrine results or general knowledge. If asked to reproduce a document you do not have, say so.]\n\n';
        const result = await queryEngine(
          memoryContext ? `${queryPrefix}[CONTEXT: ${memoryContext.slice(0, 500)}]\n\n${text}` : `${queryPrefix}${text}`,
          analysisMode
        );

        // Merge doctrine results: engine cloud results + runtime doctrine results
        const mergedDoctrines = doctrineResults.length > 0 ? doctrineResults : undefined;

        // Prefer summary (concise) over full analysis; truncate long responses
        const responseContent = result.summary || (result.analysis?.length > 600 ? result.analysis.slice(0, 600) + '...' : result.analysis);

        assistantMsg = {
          id: `a_${Date.now()}`, role: 'assistant', timestamp: Date.now(),
          content: responseContent,
          confidence: result.confidence,
          sources: result.sources_cited + (doctrineResults.length || 0),
          cost: commanderMode ? 0 : result.usage.cost,
          remaining: commanderMode ? 999999 : result.usage.remaining,
          hash: result.determinism_hash,
          reportId: result.report_id,
          reportAvailable: result.report_available,
          domain: domainsQueried.length > 0 ? domainsQueried.join(' + ') : result.domain,
          domainCost: result.domain_cost,
          mode: 'standard',
          emotion,
          voiceId,
          doctrineResults: mergedDoctrines,
          domainsQueried: domainsQueried.length > 0 ? domainsQueried : undefined,
        };

        // Store to memory
        brainIngest(SENTINEL_INSTANCE, `Q: ${text}\nA: ${(result.summary || result.analysis).slice(0, 500)}`, 5, ['sentinel', 'standard']).catch(() => {});
      }

      setMessages(prev => [...prev, assistantMsg]);

      // ── Tax/CPA Upsell — promote tax return preparation service ──
      const isTaxDomain = activePreset === 'Tax / CPA' || selectedDomains.some(d => ['TX', 'ACCT', 'TXLAW', 'TXRE', 'TXINS'].includes(d));
      if (isTaxDomain) {
        const taxReturnKeywords = /\b(tax return|file|filing|1040|1065|1120|schedule [a-e]|w-2|w2|1099|refund|owe|irs|prepare|preparation|cpa|accountant|deduction|credit|eitc|standard deduction|itemize|dependent|withholding|estimated tax|quarterly|extension|amended|prior year)\b/i;
        const queryIsTaxReturn = taxReturnKeywords.test(text);
        // Build autofill params from intake data
        const taxParams = new URLSearchParams();
        if (intakeData.entityType) taxParams.set('entity', intakeData.entityType);
        if (intakeData.taxYear) taxParams.set('year', intakeData.taxYear);
        if (intakeData.state) taxParams.set('state', intakeData.state);
        if (intakeData.industry) taxParams.set('industry', intakeData.industry);
        if (intakeData.filingStatus) taxParams.set('filing', intakeData.filingStatus);
        if (intakeData.income) taxParams.set('income', intakeData.income.slice(0, 100));
        const paramStr = taxParams.toString();
        const taxLink = `/tax-returns${paramStr ? `?${paramStr}` : ''}`;
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `upsell_${Date.now()}`, role: 'system', timestamp: Date.now(),
            content: queryIsTaxReturn
              ? `💼 **Need your taxes prepared?** Echo Prime Technologies offers AI-powered tax return preparation — individual, partnership, corporate, and trust returns. Your intake details can be sent directly to auto-fill your return.\n\n[Start Your Tax Return →](${taxLink})`
              : `💡 **Did you know?** Echo Prime Technologies offers full AI-powered tax return preparation. From simple 1040s to complex partnership and corporate filings — prepared by our tax engines and reviewed by professionals.\n\n[Learn More →](${taxLink})`,
          }]);
        }, 1500);
      }

      // Update usage
      if (usage && assistantMsg.cost !== undefined && !commanderMode) {
        setUsage({
          ...usage,
          queries: usage.queries + 1,
          remaining: assistantMsg.remaining ?? usage.remaining,
          total_cost: usage.total_cost + (assistantMsg.cost || 0),
        });
      }

      // Auto-play voice with ElevenLabs v3 emotion tags
      if (voiceEnabled && assistantMsg.content) {
        playVoice(assistantMsg.content, voiceId, emotion?.dominant);
      }

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      const errorMsg = msg === 'unauthorized' ? 'API key expired. Please re-register.'
        : msg === 'rate_limit_exceeded' ? 'Monthly limit reached. Upgrade your plan.'
        : msg.includes('domain_restricted') ? 'This domain requires a paid plan.'
        : `Error: ${msg}`;

      setMessages(prev => [...prev, { id: `e_${Date.now()}`, role: 'system', content: errorMsg, timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, apiKeyReady, analysisMode, sentinelMode, usage, personality, voiceEnabled, commanderMode, cortexStats, playVoice, selectedDomains, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Helpers ──

  const modeColors: Record<SentinelMode, string> = {
    standard: '#6366f1',
    swarm: '#f59e0b',
    echo_prime: '#a855f7',
  };

  const modeLabels: Record<SentinelMode, string> = {
    standard: 'Standard',
    swarm: 'Swarm',
    echo_prime: 'Echo Prime',
  };

  // ── Format elapsed time ──
  const formatElapsed = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s.toString().padStart(2, '0')}s` : `${s}s`;
  };

  // ── Estimate ETA based on mode and elapsed time ──
  const getETA = (elapsed: number, mode: SentinelMode) => {
    const baseTimes: Record<SentinelMode, number> = { standard: 8, swarm: 15, echo_prime: 12 };
    const base = baseTimes[mode];
    const remaining = Math.max(0, base - elapsed);
    if (elapsed > base + 10) return 'finalizing...';
    if (remaining <= 1) return '< 1s';
    return `~${remaining}s`;
  };

  // ── Render ──

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0a0a0f', color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hidden audio element */}
      <audio ref={audioRef} style={{ display: 'none' }} />

      {/* ═══ Sidebar ═══ */}
      {sidebarOpen && (
        <div style={{ width: 290, borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', backgroundColor: '#0f1117', flexShrink: 0, overflowY: 'auto' }}>
          {/* Logo */}
          <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e293b' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #6366f1, #1e1b4b)', boxShadow: '0 0 16px #6366f144' }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Sentinel</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Intelligence Engine</div>
              </div>
            </Link>
            {commanderMode && (
              <div style={{ marginTop: 8, padding: '4px 10px', borderRadius: 6, backgroundColor: '#f59e0b15', border: '1px solid #f59e0b40', fontSize: 11, fontWeight: 700, color: '#f59e0b', textAlign: 'center' }}>
                COMMANDER — UNLIMITED
              </div>
            )}
          </div>

          {/* Sentinel Mode Selector */}
          <div style={{ padding: '12px', borderBottom: '1px solid #1e293b' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mode</div>
            {(['standard', 'swarm', 'echo_prime'] as SentinelMode[]).map(m => (
              <button key={m} onClick={() => setSentinelMode(m)} style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', marginBottom: 4,
                borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left',
                fontSize: 13, fontWeight: sentinelMode === m ? 600 : 400,
                color: sentinelMode === m ? '#f1f5f9' : '#94a3b8',
                backgroundColor: sentinelMode === m ? '#1e293b' : 'transparent',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: modeColors[m], opacity: sentinelMode === m ? 1 : 0.4 }} />
                <div>
                  <div>{modeLabels[m]}</div>
                  <div style={{ fontSize: 10, color: '#475569', fontWeight: 400 }}>
                    {m === 'standard' && 'Doctrine engine'}
                    {m === 'swarm' && (swarmOnline ? 'Trinity Council' : 'Trinity offline')}
                    {m === 'echo_prime' && 'Personality + Memory'}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Analysis Mode (for standard + echo_prime) */}
          {sentinelMode !== 'swarm' && (
            <div style={{ padding: '12px', borderBottom: '1px solid #1e293b' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analysis</div>
              {(['FAST', 'DEFENSE', 'MEMO'] as AnalysisMode[]).map(m => (
                <button key={m} onClick={() => setAnalysisMode(m)} style={{
                  display: 'block', width: '100%', padding: '7px 12px', marginBottom: 3, borderRadius: 8,
                  border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 12,
                  fontWeight: analysisMode === m ? 600 : 400,
                  color: analysisMode === m ? '#f1f5f9' : '#94a3b8',
                  backgroundColor: analysisMode === m ? '#1e293b' : 'transparent',
                }}>
                  {m === 'FAST' && '⚡ Fast'}
                  {m === 'DEFENSE' && '🛡️ Defense'}
                  {m === 'MEMO' && '📋 Memo'}
                </button>
              ))}
            </div>
          )}

          {/* Domain Selector — Engine Intelligence Focus */}
          <div style={{ padding: '12px', borderBottom: '1px solid #1e293b' }}>
            <button onClick={() => setShowDomainSelector(!showDomainSelector)} style={{
              width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', padding: 0,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Engine Domains</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {selectedDomains.length > 0 && (
                    <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, backgroundColor: '#6366f120', color: '#818cf8', fontWeight: 700 }}>
                      {selectedDomains.length}
                    </span>
                  )}
                  <span style={{ fontSize: 10 }}>{showDomainSelector ? '▲' : '▼'}</span>
                </div>
              </div>
              {activePreset && (
                <div style={{ fontSize: 12, color: '#818cf8', fontWeight: 600, marginTop: 2 }}>
                  {DOMAIN_PRESETS.find(p => p.label === activePreset)?.icon} {activePreset}
                </div>
              )}
              {!activePreset && selectedDomains.length === 0 && (
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>All domains (general)</div>
              )}
            </button>
            {showDomainSelector && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 10, color: '#475569', marginBottom: 6 }}>Select your professional domain for targeted engine queries:</div>
                <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                  {DOMAIN_PRESETS.map(preset => {
                    const isActive = activePreset === preset.label;
                    return (
                      <button key={preset.label} onClick={() => {
                        if (isActive) {
                          setSelectedDomains([]);
                          setActivePreset(null);
                        } else {
                          setSelectedDomains(preset.domains);
                          setActivePreset(preset.label);
                          // Auto-show intake form for domains that have one
                          if (preset.label in DOMAIN_INTAKE_FORMS || preset.label === 'Landman / Title') {
                            setIntakeFormDomain(preset.label);
                            setIntakeData({ state: 'Texas', county: '', section: '', block: '', lots: '', survey: '', currentOwners: '', previousOwners: '', notes: '' });
                            setShowIntakeForm(true);
                          }
                        }
                      }} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 8, width: '100%', padding: '8px 10px', marginBottom: 3,
                        borderRadius: 8, border: `1px solid ${isActive ? '#6366f140' : 'transparent'}`, cursor: 'pointer', textAlign: 'left',
                        backgroundColor: isActive ? '#6366f110' : 'transparent',
                      }}>
                        <span style={{ fontSize: 16, lineHeight: '20px', flexShrink: 0 }}>{preset.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? '#818cf8' : '#e2e8f0' }}>{preset.label}</div>
                          <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.3 }}>{preset.desc}</div>
                          {isActive && preset.domains.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
                              {preset.domains.map(d => (
                                <span key={d} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, backgroundColor: '#1e293b', color: '#94a3b8', fontFamily: 'monospace' }}>{d}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        {isActive && <span style={{ fontSize: 12, color: '#818cf8', flexShrink: 0 }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Personality Selector (Echo Prime mode) */}
          {sentinelMode === 'echo_prime' && (
            <div style={{ padding: '12px', borderBottom: '1px solid #1e293b' }}>
              <button onClick={() => setShowPersonalities(!showPersonalities)} style={{
                width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', padding: 0,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Personality</span>
                  <span style={{ fontSize: 10 }}>{showPersonalities ? '▲' : '▼'}</span>
                </div>
                <div style={{ fontSize: 13, color: '#a855f7', fontWeight: 600 }}>
                  {PERSONALITY_PROFILES[personality]?.name || 'Echo Prime'}
                </div>
              </button>
              {showPersonalities && (
                <div style={{ marginTop: 8, maxHeight: 200, overflowY: 'auto' }}>
                  {Object.values(PERSONALITY_PROFILES).map(p => (
                    <button key={p.id} onClick={() => { setPersonality(p.id); setShowPersonalities(false); }} style={{
                      display: 'block', width: '100%', padding: '6px 10px', marginBottom: 2, borderRadius: 6,
                      border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 12,
                      color: personality === p.id ? '#a855f7' : '#94a3b8',
                      backgroundColor: personality === p.id ? '#a855f710' : 'transparent',
                    }}>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: '#475569' }}>{p.tone}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Memory Cortex Panel */}
          <div style={{ padding: '12px', borderBottom: '1px solid #1e293b' }}>
            <button onClick={() => setMemoryPanelOpen(!memoryPanelOpen)} style={{
              width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', padding: 0,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Memory Cortex</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {cortexStats?.contextInjected && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 2s infinite' }} />}
                  <span style={{ fontSize: 10 }}>{memoryPanelOpen ? '▲' : '▼'}</span>
                </div>
              </div>
            </button>
            {memoryPanelOpen && cortexStats && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
                  {[
                    { label: 'Brain', value: cortexStats.sharedBrainMemories },
                    { label: 'Sentinel', value: cortexStats.sentinelMemories },
                    { label: 'Relationship', value: `L${cortexStats.relationshipLevel}` },
                    { label: 'Recent', value: cortexStats.recentExtractions },
                  ].map(s => (
                    <div key={s.label} style={{ padding: '6px 8px', borderRadius: 6, backgroundColor: '#1e293b', fontSize: 11 }}>
                      <div style={{ color: '#64748b' }}>{s.label}</div>
                      <div style={{ color: '#f1f5f9', fontWeight: 600, fontFamily: 'monospace' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
                {/* Memory Search */}
                <div style={{ display: 'flex', gap: 4 }}>
                  <input
                    id="memory-search"
                    name="memory-search"
                    value={memorySearch}
                    onChange={e => setMemorySearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleMemorySearch()}
                    placeholder="Search memory..."
                    autoComplete="off"
                    style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: '1px solid #334155', backgroundColor: '#0f1117', color: '#e2e8f0', fontSize: 11, outline: 'none' }}
                  />
                  <button onClick={handleMemorySearch} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', backgroundColor: '#6366f1', color: '#fff', fontSize: 11, cursor: 'pointer' }}>
                    Go
                  </button>
                </div>
                {memoryResults.length > 0 && (
                  <div style={{ marginTop: 6, maxHeight: 120, overflowY: 'auto' }}>
                    {memoryResults.map((r, i) => (
                      <div key={i} style={{ padding: '4px 6px', borderRadius: 4, backgroundColor: '#1e293b', marginBottom: 3, fontSize: 10, color: '#94a3b8', lineHeight: 1.4 }}>
                        {r.content.slice(0, 120)}...
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Usage Stats */}
          {usage && !commanderMode && (
            <div style={{ padding: '12px', borderBottom: '1px solid #1e293b' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Usage — {usage.month}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{usage.queries} / {usage.limit} queries</div>
              <div style={{ height: 4, borderRadius: 2, backgroundColor: '#1e293b', marginBottom: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, width: `${Math.min(100, (usage.queries / usage.limit) * 100)}%`, backgroundColor: usage.queries / usage.limit > 0.9 ? '#ef4444' : '#6366f1', transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Tier: <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{usage.tier.toUpperCase()}</span></div>
            </div>
          )}

          {/* Actions */}
          <div style={{ padding: '12px', flex: 1 }}>
            <button onClick={() => setShowPricing(true)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #334155', cursor: 'pointer', fontSize: 12, color: '#94a3b8', backgroundColor: 'transparent', marginBottom: 6, textAlign: 'left' }}>
              {profile?.tier === 'free' ? '⬆ Upgrade' : '📊 Manage Plan'}
            </button>
            <Link href="/engines" style={{ display: 'block', width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #334155', fontSize: 12, color: '#94a3b8', textDecoration: 'none', marginBottom: 6, textAlign: 'left' }}>
              ⚡ Engine Catalog
            </Link>
            <button onClick={() => setMessages([])} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #334155', cursor: 'pointer', fontSize: 12, color: '#94a3b8', backgroundColor: 'transparent', textAlign: 'left' }}>
              🗑️ Clear
            </button>
          </div>

          {/* User info */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #1e293b', fontSize: 11, color: '#64748b' }}>
            {user?.email || (apiKeyReady ? 'Authenticated' : 'Not signed in')}
          </div>
        </div>
      )}

      {/* ═══ Main Chat Area ═══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0f1117' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>
              Sentinel — 2,632 Engines
            </span>
            {activePreset && (
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, backgroundColor: '#6366f115', color: '#818cf8', fontWeight: 600, border: '1px solid #6366f130' }}>
                {DOMAIN_PRESETS.find(p => p.label === activePreset)?.icon} {activePreset}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {commanderMode && (
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, backgroundColor: '#f59e0b15', color: '#f59e0b', fontWeight: 700, border: '1px solid #f59e0b30' }}>COMMANDER</span>
            )}
            <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, backgroundColor: `${modeColors[sentinelMode]}15`, color: modeColors[sentinelMode], fontWeight: 600 }}>
              {modeLabels[sentinelMode].toUpperCase()}
            </span>
            {sentinelMode !== 'swarm' && (
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, backgroundColor: '#1e1b4b', color: '#818cf8', fontWeight: 600 }}>{analysisMode}</span>
            )}
            <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, backgroundColor: '#0f2a1a', color: '#10b981', fontWeight: 600 }}>🔒 ENCRYPTED</span>
          </div>
        </div>

        {/* Messages / Agentic Mode */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>

            {/* ═══ Agentic Deep Analysis Panel ═══ */}
            {agenticMode && (
              <div style={{ marginBottom: 24 }}>
                <AgenticProgressPanel
                  plan={agenticPlan}
                  steps={agenticSteps}
                  status={agenticStatus}
                  elapsed={agenticElapsed}
                  onCancel={cancelAgentic}
                />
                {agenticStatus === 'complete' && !agenticDocument && agenticSession && (
                  <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 8, backgroundColor: '#111827', border: '1px solid #1e293b', fontSize: 13, color: '#94a3b8' }}>
                    Analysis complete. Loading document...
                    <button onClick={async () => {
                      try {
                        const html = await getAgenticDocument(agenticSession);
                        setAgenticDocument(html);
                      } catch { /* retry manually */ }
                    }} style={{ marginLeft: 12, padding: '4px 12px', borderRadius: 6, border: '1px solid #334155', backgroundColor: 'transparent', color: '#818cf8', cursor: 'pointer', fontSize: 12 }}>
                      Retry
                    </button>
                  </div>
                )}
                {['complete', 'failed', 'cancelled'].includes(agenticStatus) && (
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button onClick={closeAgenticMode} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #334155', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                      Back to Chat
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ═══ Document Viewer Overlay ═══ */}
            {agenticDocument && agenticSession && (
              <DocumentViewer
                html={agenticDocument}
                sessionId={agenticSession}
                onClose={() => setAgenticDocument(null)}
              />
            )}

            {messages.map(msg => (
              <div key={msg.id} style={{ marginBottom: 20 }}>
                {msg.role === 'user' ? (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: commanderMode ? '#f59e0b' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: commanderMode ? '#0a0a0f' : '#f1f5f9', flexShrink: 0 }}>
                      {commanderMode ? '★' : (user?.displayName?.[0]?.toUpperCase() || 'U')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: commanderMode ? '#f59e0b' : '#f1f5f9', marginBottom: 4 }}>{commanderMode ? 'Commander' : 'You'}</div>
                      <div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    </div>
                  </div>
                ) : msg.role === 'assistant' ? (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: msg.mode === 'swarm'
                        ? 'radial-gradient(circle at 35% 35%, #f59e0b, #78350f)'
                        : msg.mode === 'echo_prime'
                          ? 'radial-gradient(circle at 35% 35%, #a855f7, #3b0764)'
                          : 'radial-gradient(circle at 35% 35%, #6366f1, #1e1b4b)',
                      boxShadow: `0 0 12px ${modeColors[msg.mode || 'standard']}33`,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: modeColors[msg.mode || 'standard'] }}>
                          {msg.mode === 'swarm' ? 'Trinity Council' : msg.mode === 'echo_prime' ? (msg.personality?.name || 'Echo Prime') : 'Sentinel'}
                        </span>
                        {msg.confidence && (
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, backgroundColor: getConfidenceColor(msg.confidence) + '22', color: getConfidenceColor(msg.confidence), fontWeight: 600 }}>
                            {getConfidenceLabel(msg.confidence)}
                          </span>
                        )}
                        {msg.emotion && msg.emotion.dominant !== 'neutral' && (
                          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, backgroundColor: '#a855f715', color: '#c084fc' }}>
                            {msg.emotion.dominant}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.7, whiteSpace: 'pre-wrap', backgroundColor: '#111827', borderRadius: 12, padding: '16px 20px', border: `1px solid ${msg.mode === 'swarm' ? '#f59e0b20' : '#1e293b'}` }}>
                        {msg.content}

                        {/* Trinity votes */}
                        {msg.trinity && (
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #1e293b' }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#f59e0b', marginBottom: 6 }}>
                              Trinity Council — Consensus: {((msg.trinity.consensus_score || 0) * 100).toFixed(0)}% ({msg.trinity.harmony_level || 'unknown'})
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {(msg.trinity.votes || []).map((v, i) => (
                                <div key={i} style={{ padding: '4px 8px', borderRadius: 6, backgroundColor: '#1e293b', fontSize: 10, color: '#94a3b8' }}>
                                  <span style={{ fontWeight: 600, color: '#f59e0b' }}>{v.model}</span>: {v.decision.slice(0, 60)}
                                  <span style={{ color: '#64748b' }}> ({(v.confidence * 100).toFixed(0)}%)</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Doctrine citations */}
                        {msg.doctrineResults && msg.doctrineResults.length > 0 && (
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #1e293b' }}>
                            <button onClick={() => setShowDoctrineDetail(showDoctrineDetail === msg.id ? null : msg.id)} style={{
                              display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', padding: 0,
                            }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: '#818cf8' }}>
                                {msg.doctrineResults.length} Doctrine{msg.doctrineResults.length > 1 ? 's' : ''} Cited
                              </span>
                              {msg.domainsQueried && (
                                <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, backgroundColor: '#1e293b', color: '#94a3b8', fontFamily: 'monospace' }}>
                                  {msg.domainsQueried.join(', ')}
                                </span>
                              )}
                              <span style={{ fontSize: 10, color: '#475569' }}>{showDoctrineDetail === msg.id ? '▲' : '▼'}</span>
                            </button>
                            {showDoctrineDetail === msg.id && (
                              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {msg.doctrineResults.map((doc, di) => {
                                  const badge = getConfidenceBadge(doc.confidence);
                                  return (
                                    <div key={di} style={{ padding: '10px 12px', borderRadius: 8, backgroundColor: '#0a0a0f', border: '1px solid #1e293b' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>{doc.topic}</span>
                                        <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, backgroundColor: badge.color + '20', color: badge.color, fontWeight: 700 }}>
                                          {badge.label}
                                        </span>
                                        <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, backgroundColor: '#1e293b', color: '#64748b', fontFamily: 'monospace' }}>
                                          {doc.domain}
                                        </span>
                                        {doc.score > 0 && (
                                          <span style={{ fontSize: 9, color: '#475569', marginLeft: 'auto' }}>
                                            {(doc.score * 100).toFixed(0)}% match
                                          </span>
                                        )}
                                      </div>
                                      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{doc.conclusion}</div>
                                      {doc.reasoning && (
                                        <div style={{ fontSize: 11, color: '#475569', marginTop: 4, lineHeight: 1.4, borderTop: '1px solid #1e293b40', paddingTop: 4 }}>
                                          {doc.reasoning.slice(0, 200)}{doc.reasoning.length > 200 ? '...' : ''}
                                        </div>
                                      )}
                                      {doc.authority && doc.authority.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
                                          {doc.authority.slice(0, 3).map((a, ai) => (
                                            <span key={ai} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, backgroundColor: '#1e293b', color: '#64748b' }}>
                                              {a.slice(0, 60)}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Report download */}
                        {msg.reportAvailable && msg.reportId && (
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #1e293b' }}>
                            <button onClick={async () => {
                              try {
                                const report = await downloadReport(msg.reportId!);
                                const blob = new Blob([report], { type: 'text/markdown' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url; a.download = `report-${msg.reportId}.md`; a.click();
                                URL.revokeObjectURL(url);
                              } catch { alert('Download failed.'); }
                            }} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #6366f1', backgroundColor: '#6366f110', color: '#818cf8', cursor: 'pointer', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                              Download Report
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Metadata bar */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6, fontSize: 10, color: '#475569' }}>
                        {msg.domain && msg.domain !== 'GENERAL' && msg.domain !== 'LLM_FALLBACK' && (
                          <span style={{ padding: '2px 6px', borderRadius: 4, backgroundColor: '#1e293b', color: '#94a3b8' }}>{msg.domain.replace(/_/g, ' ')}</span>
                        )}
                        {msg.sources !== undefined && msg.sources > 0 && <span>{msg.sources} sources</span>}
                        {msg.domainCost !== undefined && msg.domainCost > 0 && !commanderMode && <span>${msg.domainCost.toFixed(2)}/q</span>}
                        {msg.remaining !== undefined && !commanderMode && <span>{msg.remaining} left</span>}
                        {msg.hash && <span title="Determinism hash">#{msg.hash}</span>}
                        {msg.personality && <span style={{ color: '#c084fc' }}>{msg.personality.name}</span>}
                      </div>
                    </div>
                  </div>
                ) : msg.id.startsWith('upsell_') ? (
                  <div style={{ padding: '14px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #0d948810, #6366f110)', border: '1px solid #14b8a640', fontSize: 13, color: '#cbd5e1', lineHeight: 1.7 }}>
                    <div style={{ whiteSpace: 'pre-wrap', marginBottom: 10 }}>{msg.content.split(/\[.*?\]\(.*?\)/)[0].trim()}</div>
                    <Link href={(msg.content.match(/\]\(([^)]+)\)/)?.[1]) || '/tax-returns'} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 20px', borderRadius: 8, backgroundColor: '#0d9488', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      {(msg.content.match(/\[([^\]]+)\]/)?.[1] || 'Explore Tax Return Services').replace(' →', '')}
                    </Link>
                  </div>
                ) : (
                  <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: '#1e293b44', border: '1px solid #334155', fontSize: 13, color: '#94a3b8', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </div>
                )}
              </div>
            ))}
            {loading && (() => {
              const steps = WORKING_STEPS[sentinelMode] || WORKING_STEPS.standard;
              const currentStep = steps[Math.min(loadingStepIndex, steps.length - 1)];
              const progressPct = Math.min(95, ((loadingStepIndex + 1) / steps.length) * 100);
              const fact = ECHO_FACTS[loadingFactIndex % ECHO_FACTS.length];
              const modeColor = modeColors[sentinelMode];
              return (
              <div style={{ marginBottom: 20, borderRadius: 16, overflow: 'hidden', border: `1px solid ${modeColor}30`, background: 'linear-gradient(135deg, #0c1220 0%, #111827 50%, #0c1220 100%)' }}>
                {/* Header — Mode + Timer + ETA */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${modeColor}20`, background: `linear-gradient(90deg, ${modeColor}08, transparent)` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: modeColor, animation: 'pulse 1.5s infinite', boxShadow: `0 0 12px ${modeColor}88` }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: modeColor, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {sentinelMode === 'swarm' ? 'Trinity Council' : sentinelMode === 'echo_prime' ? 'Echo Prime' : 'Sentinel'} — Working
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span style={{ fontSize: 13, fontFamily: 'monospace', color: '#e2e8f0', fontWeight: 600 }}>{formatElapsed(loadingElapsed)}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', padding: '2px 8px', borderRadius: 6, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                      ETA {getETA(loadingElapsed, sentinelMode)}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ height: 3, backgroundColor: '#1e293b', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progressPct}%`, background: `linear-gradient(90deg, ${modeColor}, ${modeColor}aa)`, transition: 'width 0.8s ease', borderRadius: '0 2px 2px 0', boxShadow: `0 0 8px ${modeColor}66` }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: `linear-gradient(90deg, transparent 0%, ${modeColor}33 50%, transparent 100%)`, animation: 'shimmer 2s infinite' }} />
                </div>

                {/* Pipeline Steps */}
                <div style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {steps.map((step, i) => {
                    const isDone = i < loadingStepIndex;
                    const isCurrent = i === loadingStepIndex;
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 8,
                        fontSize: 11, fontWeight: isCurrent ? 600 : 400, whiteSpace: 'nowrap',
                        backgroundColor: isCurrent ? `${modeColor}18` : isDone ? '#1e293b' : '#0f172a',
                        border: `1px solid ${isCurrent ? `${modeColor}44` : isDone ? '#334155' : '#1e293b22'}`,
                        color: isCurrent ? modeColor : isDone ? '#94a3b8' : '#475569',
                        transition: 'all 0.4s ease',
                      }}>
                        <span style={{ fontSize: 12 }}>{isDone ? '✓' : isCurrent ? step.icon : '○'}</span>
                        <span>{step.label}</span>
                        {isCurrent && <span style={{ animation: 'blink 1s infinite', marginLeft: 2 }}>|</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Active Step Detail */}
                <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, backgroundColor: `${modeColor}15`, border: `1px solid ${modeColor}30`,
                    animation: 'pulse 2s infinite',
                  }}>
                    {currentStep.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{currentStep.label}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      {activePreset ? `${activePreset} preset` : `${selectedDomains.length || 210} domains`} · Step {loadingStepIndex + 1} of {steps.length}
                    </div>
                  </div>
                  {/* Spinning radar SVG */}
                  <svg width="32" height="32" viewBox="0 0 40 40" style={{ animation: 'spin 3s linear infinite', opacity: 0.5 }}>
                    <circle cx="20" cy="20" r="18" stroke={modeColor} strokeWidth="1" fill="none" opacity="0.2" />
                    <circle cx="20" cy="20" r="12" stroke={modeColor} strokeWidth="1" fill="none" opacity="0.3" />
                    <circle cx="20" cy="20" r="6" stroke={modeColor} strokeWidth="1" fill="none" opacity="0.4" />
                    <line x1="20" y1="20" x2="20" y2="2" stroke={modeColor} strokeWidth="2" opacity="0.8" />
                    <circle cx="20" cy="2" r="2" fill={modeColor} />
                  </svg>
                </div>

                {/* Fun Fact / Trivia Bar */}
                <div style={{
                  padding: '12px 20px', borderTop: `1px solid ${modeColor}15`,
                  background: `linear-gradient(90deg, ${modeColor}06, transparent, ${modeColor}06)`,
                  display: 'flex', alignItems: 'center', gap: 12, minHeight: 52,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, backgroundColor: '#1e293b', border: '1px solid #334155', flexShrink: 0,
                  }}>
                    {fact.icon}
                  </div>
                  <div style={{ flex: 1, transition: 'opacity 0.5s ease' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: modeColor, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>
                      {fact.category}
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                      {fact.text}
                    </div>
                  </div>
                </div>
              </div>
              );
            })()}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ═══ Input Area ═══ */}
        <div style={{ borderTop: '1px solid #1e293b', padding: '14px 24px', backgroundColor: '#0f1117' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {apiKeyReady ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                {/* Voice toggle */}
                <button onClick={() => setVoiceEnabled(!voiceEnabled)} title={voiceEnabled ? 'Voice ON' : 'Voice OFF'} style={{
                  width: 38, height: 38, borderRadius: 10, border: `1px solid ${voiceEnabled ? '#a855f7' : '#334155'}`,
                  backgroundColor: voiceEnabled ? '#a855f710' : 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={voiceEnabled ? '#a855f7' : '#64748b'} strokeWidth="2" strokeLinecap="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    {voiceEnabled && <>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </>}
                  </svg>
                </button>
                <textarea
                  ref={inputRef}
                  id="sentinel-input"
                  name="sentinel-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    sentinelMode === 'swarm' ? 'Ask the Trinity Council...'
                    : activePreset ? `Ask about ${activePreset.toLowerCase()}...`
                    : 'Ask anything — tax, legal, cybersecurity, engineering...'
                  }
                  disabled={loading}
                  rows={1}
                  autoComplete="off"
                  style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f1f5f9', fontSize: 14, outline: 'none', resize: 'none', lineHeight: 1.5, minHeight: 40, maxHeight: 200, fontFamily: 'inherit' }}
                  onInput={e => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 200) + 'px'; }}
                />
                {/* Deep Analysis button — visible when Landman preset or relevant domains active */}
                {(activePreset === 'Landman / Title' || selectedDomains.some(d => ['LAND', 'LG', 'OILGAS'].includes(d))) && (
                  <button
                    onClick={() => { setIntakeFormDomain(activePreset || ''); setShowIntakeForm(true); }}
                    disabled={loading || agenticMode}
                    title="Chain of Title — structured property analysis"
                    style={{
                      height: 38, padding: '0 14px', borderRadius: 10, border: '1px solid #14b8a6',
                      cursor: loading || agenticMode ? 'default' : 'pointer',
                      backgroundColor: loading || agenticMode ? '#1e293b' : '#0d9488',
                      color: '#fff', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    Chain of Title
                  </button>
                )}
                <button data-send-btn onClick={sendMessage} disabled={loading || !input.trim()} style={{
                  width: 38, height: 38, borderRadius: 10, border: 'none',
                  cursor: loading || !input.trim() ? 'default' : 'pointer',
                  backgroundColor: loading || !input.trim() ? '#1e293b' : modeColors[sentinelMode],
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 12 }}>
                  Try 3 free queries. Court-defensible AI. No credit card required.
                </p>
                {user?.email ? (
                  <button onClick={handleAutoRegister} style={{ padding: '12px 32px', borderRadius: 10, border: 'none', cursor: 'pointer', backgroundColor: '#6366f1', color: '#fff', fontSize: 14, fontWeight: 600 }}>
                    Activate Free Plan — {user.email}
                  </button>
                ) : (
                  <Link href="/login" style={{ display: 'inline-block', padding: '12px 32px', borderRadius: 10, backgroundColor: '#6366f1', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                    Sign In to Get Started
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Domain Intake Form (Dynamic — works for ALL domains) ═══ */}
      {showIntakeForm && (() => {
        const isLandman = intakeFormDomain === 'Landman / Title';
        const domainForm = DOMAIN_INTAKE_FORMS[intakeFormDomain];
        const presetIcon = DOMAIN_PRESETS.find(p => p.label === intakeFormDomain)?.icon || '🔍';

        // Helper: check if required fields are filled for generic domains
        const genericRequiredFilled = domainForm
          ? domainForm.fields.filter(f => f.required).every(f => (intakeData[f.key] || '').trim())
          : true;
        const landmanRequiredFilled = !!(intakeData.county && intakeData.section && intakeData.block);
        const canSubmit = apiKeyReady && (isLandman ? landmanRequiredFilled : genericRequiredFilled);

        // Handler: submit generic domain form
        const submitGenericForm = () => {
          if (!domainForm || !canSubmit) return;
          const parts: string[] = [];
          domainForm.fields.forEach(f => {
            const val = (intakeData[f.key] || '').trim();
            if (val) parts.push(`**${f.label}**: ${val}`);
          });
          const text = parts.join('\n');
          setShowIntakeForm(false);

          // Build freeform query from the scenario/main field
          const mainField = domainForm.fields.find(f => f.key === 'scenario');
          const queryText = intakeData.scenario || intakeData[domainForm.fields[domainForm.fields.length - 1]?.key] || text;
          setInput(queryText);

          // Add structured message and trigger standard analysis
          const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', content: `**${domainForm.title}**\n${text}`, timestamp: Date.now() };
          setMessages(prev => [...prev, userMsg]);
          setInput('');

          // Use the text input + send for non-agentic domains
          setTimeout(() => {
            const fakeInput = mainField ? (intakeData.scenario || queryText) : queryText;
            setInput(fakeInput);
            // Auto-send after a tick
            setTimeout(() => {
              const btn = document.querySelector<HTMLButtonElement>('[data-send-btn]');
              if (btn) btn.click();
            }, 100);
          }, 50);
        };

        return (
        <div onClick={() => setShowIntakeForm(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#0f1629', borderRadius: 16, border: '1px solid #1e3a5f', padding: 32, maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#0d948820', border: '1px solid #14b8a6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {presetIcon}
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                  {isLandman ? 'Chain of Title Analysis' : domainForm?.title || intakeFormDomain}
                </h2>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                  {isLandman ? 'Enter property details for deep agentic analysis' : domainForm?.subtitle || 'Enter details for targeted analysis'}
                </p>
              </div>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: '#0d948815', border: '1px solid #14b8a630', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontSize: 16, flexShrink: 0, lineHeight: '20px' }}>💡</span>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                <strong style={{ color: '#14b8a6' }}>Better details = better answers.</strong> Every field you fill helps our 2,632 engines find the most relevant doctrine blocks. Required fields get you started, but optional fields dramatically improve accuracy, specificity, and actionability.
              </p>
            </div>

            {/* ═══ LANDMAN-SPECIFIC FORM ═══ */}
            {isLandman && (<>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>State *</label>
                  <select value={intakeData.state || 'Texas'} onChange={e => setIntakeData(d => ({ ...d, state: e.target.value }))} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f1f5f9', fontSize: 14, outline: 'none' }}>
                    <option value="Texas">Texas</option><option value="New Mexico">New Mexico</option><option value="Oklahoma">Oklahoma</option><option value="Louisiana">Louisiana</option><option value="North Dakota">North Dakota</option><option value="Colorado">Colorado</option><option value="Wyoming">Wyoming</option><option value="Pennsylvania">Pennsylvania</option><option value="West Virginia">West Virginia</option><option value="Ohio">Ohio</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>County *</label>
                  <input type="text" value={intakeData.county || ''} onChange={e => setIntakeData(d => ({ ...d, county: e.target.value }))} placeholder="e.g. Reeves" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f1f5f9', fontSize: 14, outline: 'none' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>Section *</label>
                  <input type="text" value={intakeData.section || ''} onChange={e => setIntakeData(d => ({ ...d, section: e.target.value }))} placeholder="e.g. 270" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f1f5f9', fontSize: 14, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>Block *</label>
                  <input type="text" value={intakeData.block || ''} onChange={e => setIntakeData(d => ({ ...d, block: e.target.value }))} placeholder="e.g. 8" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f1f5f9', fontSize: 14, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>Lot(s)</label>
                  <input type="text" value={intakeData.lots || ''} onChange={e => setIntakeData(d => ({ ...d, lots: e.target.value }))} placeholder="e.g. 1 & 2" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f1f5f9', fontSize: 14, outline: 'none' }} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>Survey / Abstract</label>
                <select value={intakeData.survey || ''} onChange={e => setIntakeData(d => ({ ...d, survey: e.target.value }))} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f1f5f9', fontSize: 14, outline: 'none' }}>
                  <option value="">Select survey (optional)</option><option value="H&GN RR">H&GN Railroad</option><option value="T&P RR">T&P Railroad</option><option value="GC&SF RR">GC&SF Railroad</option><option value="TCRR">TCRR</option><option value="SPRR">SPRR</option><option value="A&B">A&B</option><option value="EL&RR">EL&RR</option><option value="WCRR">WCRR</option><option value="PSL">PSL (Public School Land)</option><option value="University">University Lands</option>
                </select>
              </div>
              <div style={{ height: 1, backgroundColor: '#1e293b', margin: '20px 0' }} />
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>Known Current Owners</label>
                <textarea value={intakeData.currentOwners || ''} onChange={e => setIntakeData(d => ({ ...d, currentOwners: e.target.value }))} placeholder={"One per line, e.g.\nRidgefield Permian Minerals LLC\nPermian Resources Operating LLC"} rows={3} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f1f5f9', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>Known Previous Owners</label>
                <textarea value={intakeData.previousOwners || ''} onChange={e => setIntakeData(d => ({ ...d, previousOwners: e.target.value }))} placeholder={"One per line, e.g.\nH. Grady Chandler\nToyah Valley Grape & Alfalfa Co."} rows={3} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f1f5f9', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>Additional Notes</label>
                <textarea value={intakeData.notes || ''} onChange={e => setIntakeData(d => ({ ...d, notes: e.target.value }))} placeholder="Any other relevant info — existing leases, family relationships, known instruments, etc." rows={2} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f1f5f9', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />
              </div>
            </>)}

            {/* ═══ GENERIC DOMAIN FORM (Tax, Cyber, Engineering, Legal, Medical, Software, Finance) ═══ */}
            {!isLandman && domainForm && (
              <div>
                {domainForm.fields.map(field => (
                  <div key={field.key} style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>
                      {field.label}{field.required ? ' *' : ''}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={intakeData[field.key] || ''}
                        onChange={e => setIntakeData(d => ({ ...d, [field.key]: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f1f5f9', fontSize: 14, outline: 'none' }}
                      >
                        {field.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={intakeData[field.key] || ''}
                        onChange={e => setIntakeData(d => ({ ...d, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        rows={field.rows || 3}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f1f5f9', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={intakeData[field.key] || ''}
                        onChange={e => setIntakeData(d => ({ ...d, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#f1f5f9', fontSize: 14, outline: 'none' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>
                {isLandman ? '* Required fields. Analysis takes 10-60 minutes.' : '* Required fields. Structured input produces more targeted results.'}
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowIntakeForm(false)} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #334155', backgroundColor: 'transparent', color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {isLandman ? 'Cancel' : 'Skip'}
                </button>
                <button
                  onClick={isLandman ? startIntakeAnalysis : submitGenericForm}
                  disabled={!canSubmit}
                  style={{ padding: '10px 24px', borderRadius: 8, border: 'none', backgroundColor: canSubmit ? '#0d9488' : '#1e293b', color: '#fff', fontSize: 13, fontWeight: 600, cursor: canSubmit ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                  {isLandman ? 'Start Deep Analysis' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
        );
      })()}

      {/* ═══ Pricing Modal ═══ */}
      {showPricing && (
        <div onClick={() => setShowPricing(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#111827', borderRadius: 16, border: '1px solid #1e293b', padding: 32, maxWidth: 960, width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
              {profile?.tier === 'free' ? 'Upgrade Your Plan' : 'Manage Your Plan'}
            </h2>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>
              932 engines. 65 domains. Court-defensible. Replaces $300-500/hour professionals.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {pricingTiers.map(tier => {
                const tierKey = tier.name.toLowerCase();
                const isCurrentTier = profile?.tier === tierKey;
                const isFree = tier.price === 0;
                return (
                  <div key={tier.name} style={{ padding: 20, borderRadius: 12, border: `2px solid ${isCurrentTier ? '#10b981' : tier.popular ? '#6366f1' : '#334155'}`, position: 'relative' }}>
                    {isCurrentTier && (
                      <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: '#10b981', backgroundColor: '#111827', padding: '2px 10px', borderRadius: 4, border: '1px solid #10b981', textTransform: 'uppercase' }}>Current</div>
                    )}
                    {tier.popular && !isCurrentTier && (
                      <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, color: '#818cf8', backgroundColor: '#111827', padding: '2px 10px', borderRadius: 4, border: '1px solid #6366f1', textTransform: 'uppercase' }}>Popular</div>
                    )}
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginTop: 4 }}>{tier.name}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginTop: 8 }}>
                      {isFree ? 'Free' : `$${tier.price}`}
                      {!isFree && <span style={{ fontSize: 13, fontWeight: 400, color: '#64748b' }}>/mo</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{tier.queries.toLocaleString()} queries/month</div>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: 14 }}>
                      {(tier.features || []).map((f, i) => (
                        <li key={i} style={{ fontSize: 11, color: '#94a3b8', padding: '2px 0', display: 'flex', gap: 6 }}>
                          <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: 14 }}>
                      {isCurrentTier ? (
                        <div style={{ padding: '8px 0', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#10b981' }}>Active</div>
                      ) : isFree ? (
                        <div style={{ padding: '8px 0', textAlign: 'center', fontSize: 12, color: '#64748b' }}>Included</div>
                      ) : (
                        <button disabled={upgrading !== null} onClick={async () => {
                          setUpgrading(tierKey);
                          try {
                            const { checkout_url } = await createCheckout(tierKey as 'professional' | 'business' | 'enterprise');
                            window.location.href = checkout_url;
                          } catch { setUpgrading(null); }
                        }} style={{ width: '100%', padding: '8px 0', borderRadius: 8, border: 'none', cursor: upgrading ? 'wait' : 'pointer', fontSize: 12, fontWeight: 600, color: '#fff', backgroundColor: tier.popular ? '#6366f1' : '#334155' }}>
                          {upgrading === tierKey ? 'Redirecting...' : `Upgrade`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button onClick={() => setShowPricing(false)} style={{ padding: '8px 24px', borderRadius: 8, border: '1px solid #334155', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 12 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
