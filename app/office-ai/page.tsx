'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import ReadAloudButton from '../../components/ReadAloudButton';
import ProductTutorialButton from '../../components/product-tutorial-button';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';

/* ══════════════════════════════════════════════════════════════════════════════
   ECHO OFFICE AI — AI-Powered Office Management Platform
   Full product page: hero, metrics, features, how-it-works, pricing, CTA
   ══════════════════════════════════════════════════════════════════════════════ */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Inline SVG Icons ─── */
function InvoiceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function BookingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
    </svg>
  );
}

function CustomerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m0 0l3-3m-3 3l-3-3m12-3V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V9M15 3.75v3.75a.75.75 0 00.75.75h3.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12l-3 3m0 0l-3-3m3 3V3" />
    </svg>
  );
}

function FleetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}

function ExpenseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  );
}

function AIChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

/* ─── Conversational AI Icons ─── */
function PhoneAIIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function ReceptionistIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function TranscriptionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function OutboundIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0l-6 6m3 12c-8.284 0-15-6.716-15-15v-2.25A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.055.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
    </svg>
  );
}

function SMSIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

function VoicemailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5-1.115a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" />
    </svg>
  );
}

function SentimentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    </svg>
  );
}

function CallScoringIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

/* ─── Business Operations Icons ─── */
function InventoryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function ARAPIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function EmployeeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  );
}

function PayrollIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  );
}

function TimesheetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ReviewsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

const BIZ_OPS_FEATURES = [
  {
    title: 'Inventory Management',
    description: 'Track stock levels, set reorder points, manage suppliers, and get AI predictions for demand. Barcode scanning, warehouse zones, and real-time valuation.',
    Icon: InventoryIcon,
  },
  {
    title: 'Accounts Receivable & Payable',
    description: 'Full AR/AP management with aging reports, automated collections, vendor payment scheduling, and cash flow forecasting. Integrates with your invoicing.',
    Icon: ARAPIcon,
  },
  {
    title: 'Employee Management',
    description: 'Employee directory, role assignments, certifications tracking, document storage, onboarding workflows, and performance reviews — all in one place.',
    Icon: EmployeeIcon,
  },
  {
    title: 'Hours & Timesheets',
    description: 'GPS-verified clock-in/out, job costing, overtime calculations, PTO tracking, and approval workflows. Employees clock in from their phone on the job site.',
    Icon: TimesheetIcon,
  },
  {
    title: 'Payroll Processing',
    description: 'Calculate pay from timesheets, handle tax withholdings, generate pay stubs, and export to your payroll provider. Supports hourly, salary, and commission structures.',
    Icon: PayrollIcon,
  },
  {
    title: 'Reviews & Reputation',
    description: 'Monitor Google, Yelp, and Facebook reviews. AI-generated response suggestions, sentiment tracking, and automated review request campaigns after completed jobs.',
    Icon: ReviewsIcon,
  },
];

const CONVO_AI_FEATURES = [
  {
    title: 'AI Phone Answering',
    description: 'Never miss a call. AI answers your business line 24/7, handles inquiries, takes messages, and routes urgent calls to the right person — in natural, human-like voice.',
    Icon: PhoneAIIcon,
  },
  {
    title: 'AI Receptionist',
    description: 'A virtual front desk that greets callers by name, checks schedules, books appointments, answers FAQs, and transfers calls — all without a human operator.',
    Icon: ReceptionistIcon,
  },
  {
    title: 'Call Transcription & Notes',
    description: 'Every call automatically transcribed with AI-generated summaries, action items, and follow-up reminders. Searchable call history with keyword highlighting.',
    Icon: TranscriptionIcon,
  },
  {
    title: 'Outbound AI Calls',
    description: 'AI makes appointment confirmations, payment reminders, follow-up calls, and surveys on your behalf. Natural conversation flow with customizable scripts.',
    Icon: OutboundIcon,
  },
  {
    title: 'SMS & Text AI',
    description: 'AI-powered text messaging that responds to customer inquiries, sends appointment reminders, handles confirmations, and manages two-way conversations automatically.',
    Icon: SMSIcon,
  },
  {
    title: 'Voicemail AI',
    description: 'Smart voicemail that transcribes messages instantly, categorizes by urgency, extracts caller intent, and triggers automated follow-up workflows.',
    Icon: VoicemailIcon,
  },
  {
    title: 'Sentiment Analysis',
    description: 'Real-time emotion detection on every call and message. Flag unhappy customers instantly, identify upsell opportunities, and track satisfaction trends over time.',
    Icon: SentimentIcon,
  },
  {
    title: 'Call Analytics & Scoring',
    description: 'AI scores every interaction on resolution, politeness, efficiency, and outcome. Leaderboards for teams, coaching insights, and performance benchmarks.',
    Icon: CallScoringIcon,
  },
];

const OFFICE_FEATURES = [
  {
    title: 'Smart Invoicing',
    description: 'Generate, send, and track professional invoices with AI-powered line-item suggestions. Automatic payment reminders, recurring invoices, and real-time AR/AP tracking.',
    Icon: InvoiceIcon,
  },
  {
    title: 'Intelligent Bookings',
    description: 'AI-optimized scheduling that avoids conflicts, suggests ideal time slots, and sends automated confirmations. Embeddable booking widget for your website.',
    Icon: BookingIcon,
  },
  {
    title: 'Customer Management',
    description: 'Full customer directory with interaction history, preferences, and AI-generated relationship insights. Tag, segment, and automate communications at scale.',
    Icon: CustomerIcon,
  },
  {
    title: 'Route Optimization',
    description: 'AI-calculated optimal routes for service teams. Minimize drive time, maximize job density, and automatically adjust for traffic and cancellations.',
    Icon: RouteIcon,
  },
  {
    title: 'Fleet Management',
    description: 'Track vehicles, schedule maintenance, monitor fuel costs, and assign crews to jobs. GPS integration with real-time location and geofence alerts.',
    Icon: FleetIcon,
  },
  {
    title: 'Expense Tracking',
    description: 'Snap receipts, auto-categorize expenses, and generate tax-ready reports. AI detects duplicate entries and flags anomalies before they become problems.',
    Icon: ExpenseIcon,
  },
  {
    title: 'AI Chat Assistant',
    description: 'Embedded AI chat widget for your customers. Answers questions, books appointments, provides quotes, and escalates to a human when needed — 24/7.',
    Icon: AIChatIcon,
  },
  {
    title: 'Analytics Dashboard',
    description: 'Real-time revenue, booking, and utilization metrics. AI-generated insights highlight trends, predict slow periods, and recommend pricing adjustments.',
    Icon: AnalyticsIcon,
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Connect Your Business',
    description: 'Sign up in under 2 minutes. Import your customer list, set your services and pricing, forward your business phone number to your AI line. Multi-tenant — run multiple businesses from one account.',
  },
  {
    step: '02',
    title: 'AI Handles Everything',
    description: 'Phone calls answered, appointments booked, invoices sent, expenses categorized, routes optimized — all autonomously. The AI receptionist handles your calls while Office AI runs the backend.',
  },
  {
    step: '03',
    title: 'Grow With Insights',
    description: 'Call scoring, sentiment analysis, revenue trends, and customer retention metrics. AI recommendations help you improve call quality, price smarter, and staff better.',
  },
];

interface PricingTier {
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

const PRICING: PricingTier[] = [
  {
    name: 'Starter',
    price: 49,
    interval: '/mo',
    description: 'Perfect for solo operators getting started with AI-powered office management and basic phone AI.',
    features: [
      '1 business',
      '5 users',
      'AI Phone Answering',
      'Voicemail AI + Transcription',
      'SMS & Text AI (100/mo)',
      'Call Transcription & Notes',
      'Invoicing & billing',
      'Online bookings',
      'Customer directory',
      'Expense tracking',
      'Email support',
    ],
    popular: false,
    cta: 'Start Free Trial',
  },
  {
    name: 'Professional',
    price: 149,
    interval: '/mo',
    description: 'For growing businesses that need the full Conversational AI phone system, business operations, and fleet tools.',
    features: [
      '3 businesses',
      '25 users',
      'Everything in Starter',
      'AI Receptionist',
      'Outbound AI Calls',
      'SMS & Text AI (unlimited)',
      'Sentiment Analysis',
      'Call Analytics & Scoring',
      'Route optimization',
      'Fleet management',
      'Inventory management',
      'AR/AP management',
      'Employee management',
      'Hours & timesheets',
      'AI chat widget',
      'Analytics dashboard',
      'Priority support',
    ],
    popular: true,
    cta: 'Get Started',
  },
  {
    name: 'Enterprise',
    price: 399,
    interval: '/mo',
    description: 'Unlimited everything — Conversational AI, business operations, white-label branding, and enterprise guarantees.',
    features: [
      'Unlimited businesses',
      'Unlimited users',
      'Everything in Professional',
      'Unlimited AI phone lines',
      'Custom AI voice & persona',
      'Payroll processing',
      'Reviews & reputation mgmt',
      'White-label branding',
      'Custom domain',
      'Full API access',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom integrations',
      '24/7 phone support',
    ],
    popular: false,
    cta: 'Contact Sales',
  },
];

export default function OfficeAIPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const featSection = useInView();
  const howSection = useInView();
  const priceSection = useInView();
  const ctaSection = useInView();

  const handleCheckout = (tier: PricingTier) => {
    if (tier.price === 399) {
      window.location.href = `mailto:bob@echo-op.com?subject=Echo%20Office%20AI%20Enterprise%20Inquiry`;
      return;
    }
    const checkoutUrl = `/checkout?service=office-ai&tier=${encodeURIComponent(tier.name.toLowerCase())}`;
    if (!user) {
      window.location.href = `/signup?redirect=${encodeURIComponent(checkoutUrl)}`;
      return;
    }
    window.location.href = checkoutUrl;
  };

  return (
    <div className="min-h-screen transition-colors duration-600" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* ─── Nav ─── */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image
            src={isDark ? '/logo-night.png' : '/logo-day.png'}
            alt="Echo Prime Technologies"
            width={400}
            height={260}
            className="w-[160px] md:w-[200px] h-auto"
            style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
            priority
          />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="hidden md:inline text-sm font-medium transition-colors" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Dashboard</Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Get Started</Link>
          )}
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section data-tutorial="office-hero" className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--ept-hero-gradient)' }} />
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-3xl">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-medium mb-8 border backdrop-blur-sm" style={{ backgroundColor: 'var(--ept-accent-glow)', borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>
                <span className="relative w-2 h-2 rounded-full pulse-ring" style={{ backgroundColor: 'var(--ept-accent)' }} />
                Now Available
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight animate-fade-up animate-fade-up-delay-1" style={{ color: 'var(--ept-text)' }}>
              AI-Powered
              <br />
              <span className="gradient-text">Business Platform</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl leading-relaxed max-w-xl animate-fade-up animate-fade-up-delay-2" style={{ color: 'var(--ept-text-secondary)' }}>
              AI phone answering, receptionist, call transcription, outbound calls, SMS — plus invoicing, bookings, fleet management, and analytics. One platform for every business you run.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start animate-fade-up animate-fade-up-delay-3">
              <Link href="/signup?redirect=/checkout?service=office-ai&tier=professional" className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold transition-all hover:opacity-90 hover:gap-3" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Start Free Trial
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-0.5"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
              </Link>
              <a href="#pricing" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border font-semibold transition-all hover:border-opacity-60" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                View Pricing
              </a>
              <ReadAloudButton size="md" label="Listen" getText={() => {
                const el = document.querySelector('[data-page-content]');
                return el?.textContent?.trim().slice(0, 3000) || 'Echo Office AI is an AI-powered office management platform.';
              }} />
            </div>
          </div>

          {/* ─── Key Metrics ─── */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden animate-fade-up animate-fade-up-delay-4" style={{ backgroundColor: 'var(--ept-border)' }}>
            {[
              { value: '22+', label: 'Modules' },
              { value: 'AI Voice', label: 'Phone System' },
              { value: 'White-Label', label: 'Ready' },
              { value: 'Multi-Tenant', label: 'Architecture' },
            ].map((s, i) => (
              <div key={i} className="p-6 md:p-8 text-center transition-colors duration-500" style={{ backgroundColor: 'var(--ept-bg)' }}>
                <div className="text-2xl md:text-3xl font-extrabold font-mono gradient-text">{s.value}</div>
                <div className="mt-1.5 text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--ept-text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Conversational AI Features ─── */}
      <section data-tutorial="office-convo-ai" className="py-24 px-6" ref={featSection.ref} data-page-content>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Conversational AI</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--ept-text)' }}>
              Your AI phone system.
              <br />
              <span className="gradient-text">Always on. Always professional.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
              AI answers your calls, books appointments, sends texts, makes outbound calls, and scores every interaction — so you never miss a customer and never miss an insight.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONVO_AI_FEATURES.map((feat, i) => (
              <div
                key={i}
                className={`card-hover p-6 rounded-2xl border transition-all duration-700 ${featSection.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>
                  <feat.Icon />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{feat.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Office Management Features ─── */}
      <section data-tutorial="office-tools" className="py-24 px-6" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Office Management</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--ept-text)' }}>
              Everything your office needs.
              <br />
              <span className="gradient-text">Nothing it doesn&apos;t.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
              From solo operators to multi-location franchises, Echo Office AI handles the operational heavy lifting so you can focus on growing your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {OFFICE_FEATURES.map((feat, i) => (
              <div
                key={`office-${i}`}
                className="card-hover p-6 rounded-2xl border transition-all duration-500"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>
                  <feat.Icon />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{feat.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Business Operations Features ─── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Business Operations</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--ept-text)' }}>
              Run the whole business.
              <br />
              <span className="gradient-text">Not just the office.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
              Inventory, payroll, timesheets, AR/AP, employee management, and reputation monitoring — everything a service business needs to operate, all in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BIZ_OPS_FEATURES.map((feat, i) => (
              <div
                key={`biz-${i}`}
                className="card-hover p-6 rounded-2xl border transition-all duration-500"
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--ept-accent-glow)', color: 'var(--ept-accent)' }}>
                  <feat.Icon />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{feat.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section data-tutorial="office-demo" className="py-24 px-6" style={{ backgroundColor: 'var(--ept-surface)' }} ref={howSection.ref}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>How It Works</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--ept-text)' }}>
              Up and running in <span className="gradient-text">minutes.</span>
            </h2>
            <p className="mt-5 text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              No complex setup. No IT department required. Import your data, configure your services, and let the AI handle the rest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-2xl border transition-all duration-700 ${howSection.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', transitionDelay: `${i * 150}ms` }}
              >
                <div className="text-5xl font-extrabold font-mono mb-4 gradient-text opacity-40">{step.step}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--ept-text)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{step.description}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 inline"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section data-tutorial="office-pricing" id="pricing" className="py-24 px-6" ref={priceSection.ref}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Pricing</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--ept-text)' }}>
              Simple plans. <span className="gradient-text">Serious power.</span>
            </h2>
            <p className="mt-5 text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              Start with what you need, upgrade as you grow. All plans include a 14-day free trial. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING.map((tier, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-2xl border transition-all duration-700 ${priceSection.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{
                  backgroundColor: 'var(--ept-card-bg)',
                  borderColor: tier.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)',
                  boxShadow: tier.popular ? '0 0 40px var(--ept-accent-glow)' : 'none',
                  transitionDelay: `${i * 120}ms`,
                }}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                    Most Popular
                  </div>
                )}

                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{tier.name}</h3>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{tier.description}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold font-mono gradient-text">${tier.price}</span>
                  <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>{tier.interval}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(tier)}
                  className="w-full text-center py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                  style={{
                    backgroundColor: tier.popular ? 'var(--ept-accent)' : 'transparent',
                    color: tier.popular ? '#fff' : 'var(--ept-accent)',
                    border: tier.popular ? 'none' : '1px solid var(--ept-accent)',
                  }}
                >
                  {tier.cta}
                </button>

                {tier.price < 399 && (
                  <p className="text-center text-[10px] mt-3" style={{ color: 'var(--ept-text-muted)' }}>14-day free trial included</p>
                )}
              </div>
            ))}
          </div>

          {/* Trust signals */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
              <svg className="w-4 h-4" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              30-day money-back guarantee
            </span>
            <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>No credit card required</span>
            <span className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* ─── Who It's For ─── */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Built For</div>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Service businesses that move fast.</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Cleaning Companies', 'HVAC & Plumbing', 'Landscaping', 'Construction',
              'Auto Detailing', 'Property Management', 'Home Services', 'Pest Control',
              'Electrical Contractors', 'Consulting Firms', 'Oilfield Services', 'Delivery & Logistics',
            ].map((industry, i) => (
              <div
                key={i}
                className="card-hover px-5 py-3 rounded-xl border text-sm font-medium cursor-default transition-all"
                style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text-secondary)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ept-accent)'; e.currentTarget.style.color = 'var(--ept-text)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ept-card-border)'; e.currentTarget.style.color = 'var(--ept-text-secondary)'; }}
              >
                {industry}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 px-6 relative" ref={ctaSection.ref}>
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className={`max-w-3xl mx-auto text-center relative transition-all duration-700 ${ctaSection.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--ept-text)' }}>
            Stop managing.
            <br />
            <span className="gradient-text">Start growing.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
            Join service businesses that have automated their office operations with Echo Office AI. 14-day free trial, no credit card required.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/dashboard" className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:opacity-90 hover:gap-3" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                Go to Dashboard
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-transform group-hover:translate-x-0.5"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
              </Link>
            ) : (
              <>
                <Link href="/signup?redirect=/checkout?service=office-ai&tier=professional" className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:opacity-90 hover:gap-3" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
                  Start Free Trial
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-transform group-hover:translate-x-0.5"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
                </Link>
                <Link href="/pricing" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border font-semibold text-lg transition-all" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>
                  Compare All Plans
                </Link>
              </>
            )}
          </div>
          <div className="mt-6">
            <a href="mailto:bob@echo-op.com?subject=Echo%20Office%20AI%20Enterprise" className="text-sm underline" style={{ color: 'var(--ept-accent)' }}>Enterprise inquiries</a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      {/* Intelligence Engine Integration */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>
          Ask the Business Operations Engine
        </h2>
        <EngineQueryPanel
          domains={['BUS', 'ACCT']}
          title="Ask the Business Operations Engine"
          placeholder="Ask about invoicing, payroll, scheduling..."
          exampleQueries={['Best invoicing practices for service businesses', 'How to calculate overtime pay in Texas', 'Accounts receivable aging best practices']}
        />
      </section>
      <footer className="border-t py-12 px-6" style={{ borderColor: 'var(--ept-border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={400} height={260} className="w-[140px] h-auto opacity-80" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/pricing" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>Pricing</Link>
            <Link href="/pricing" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>All Products</Link>
            <Link href="/closer" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>AI Closer</Link>
            <Link href="/legal/privacy" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>Privacy</Link>
            <Link href="/legal/terms" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'var(--ept-text-muted)' }}>Terms</Link>
          </div>
          <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>&copy; {new Date().getFullYear()} Echo Prime Technologies</span>
        </div>
      </footer>
      <ProductTutorialButton tutorialId="office-ai" productName="Office AI" />
    </div>
  );
}
