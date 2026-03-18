'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import ReadAloudButton from '../../components/ReadAloudButton';
import ProductTutorialButton from '../../components/product-tutorial-button';
import { EngineQueryPanel } from '../../components/EngineQueryPanel';

/* ==============================================================================
   ECHO OFFICE AI — AI-Powered Office Management Platform
   Full product page: hero, metrics, features, live demo, tutorial, ROI,
   comparison, how-it-works, industries, pricing, CTA
   ============================================================================== */

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

/* --- Typewriter Effect --- */
function Typewriter({ text, speed = 25, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <>{displayed}{!done && <span className="animate-pulse">|</span>}</>;
}

/* --- Animated Counter --- */
function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView(0.3);
  useEffect(() => {
    if (!visible) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, target, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* --- ConvAI Voice Widget --- */
function AIVoiceWidget({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widgetReady, setWidgetReady] = useState(false);
  useEffect(() => {
    if (!active || !containerRef.current) return;
    let cancelled = false;
    const mount = () => {
      if (cancelled || !containerRef.current) return;
      const el = document.createElement('elevenlabs-convai');
      el.setAttribute('agent-id', 'agent_7901khgqmsy8ey1rw38py5qxzxpa');
      el.setAttribute('dynamic-variables', JSON.stringify({ user_name: 'visitor' }));
      containerRef.current.replaceChildren(el);
      setWidgetReady(true);
    };
    if (customElements.get('elevenlabs-convai')) {
      mount();
    } else {
      const existing = document.querySelector('script[src*="elevenlabs.io/convai-widget"]');
      if (!existing) {
        const s = document.createElement('script');
        s.src = 'https://elevenlabs.io/convai-widget/index.js';
        s.async = true;
        s.onload = () => {
          const wait = setInterval(() => {
            if (customElements.get('elevenlabs-convai') || cancelled) {
              clearInterval(wait);
              if (!cancelled) mount();
            }
          }, 100);
          setTimeout(() => clearInterval(wait), 10000);
        };
        document.head.appendChild(s);
      } else {
        const wait = setInterval(() => {
          if (customElements.get('elevenlabs-convai') || cancelled) {
            clearInterval(wait);
            if (!cancelled) mount();
          }
        }, 100);
        setTimeout(() => clearInterval(wait), 10000);
      }
    }
    return () => { cancelled = true; setWidgetReady(false); if (containerRef.current) containerRef.current.replaceChildren(); };
  }, [active]);
  return (
    <>
      <div ref={containerRef} />
      {active && !widgetReady && (
        <div className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center animate-pulse"
          style={{ backgroundColor: 'var(--ept-accent)', boxShadow: '0 4px 20px rgba(20,184,166,0.5)' }}>
          <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}
    </>
  );
}

/* --- Inline SVG Icons --- */
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

/* --- Conversational AI Icons --- */
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

/* --- Business Operations Icons --- */
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

/* ==============================================================================
   FEATURE DATA
   ============================================================================== */

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
    description: 'Employee directory, role assignments, certifications tracking, document storage, onboarding workflows, and performance reviews \u2014 all in one place.',
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
    description: 'Never miss a call. AI answers your business line 24/7, handles inquiries, takes messages, and routes urgent calls to the right person \u2014 in natural, human-like voice.',
    Icon: PhoneAIIcon,
  },
  {
    title: 'AI Receptionist',
    description: 'A virtual front desk that greets callers by name, checks schedules, books appointments, answers FAQs, and transfers calls \u2014 all without a human operator.',
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
    description: 'Embedded AI chat widget for your customers. Answers questions, books appointments, provides quotes, and escalates to a human when needed \u2014 24/7.',
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
    description: 'Sign up in under 2 minutes. Import your customer list, set your services and pricing, forward your business phone number to your AI line. Multi-tenant \u2014 run multiple businesses from one account.',
  },
  {
    step: '02',
    title: 'AI Handles Everything',
    description: 'Phone calls answered, appointments booked, invoices sent, expenses categorized, routes optimized \u2014 all autonomously. The AI receptionist handles your calls while Office AI runs the backend.',
  },
  {
    step: '03',
    title: 'Grow With Insights',
    description: 'Call scoring, sentiment analysis, revenue trends, and customer retention metrics. AI recommendations help you improve call quality, price smarter, and staff better.',
  },
];

/* ==============================================================================
   CONVERSATION SIMULATOR
   ============================================================================== */

interface ConvoMessage { role: 'user' | 'assistant'; text: string; }

const DEMO_CONVERSATIONS: Record<string, { title: string; icon: string; color: string; messages: ConvoMessage[] }> = {
  customer_service: {
    title: 'Customer Service',
    icon: '\uD83D\uDCAC',
    color: '#14b8a6',
    messages: [
      { role: 'user', text: 'I CANNOT BELIEVE this happened. My order arrived damaged and 3 days late. This is UNACCEPTABLE.' },
      { role: 'assistant', text: 'I completely understand how frustrating that must be, and I\'m genuinely sorry. A damaged order that\'s also late is a double hit \u2014 and your frustration is completely valid.\n\nLet me take ownership of this right now:\n1. I\'m filing a replacement/refund request immediately\n2. I\'m pulling the shipment tracking and incident details\n3. We\'ll cover expedited shipping on the replacement at no cost\n\nI know this disrupted your plans, and that\'s the part that matters most. What I CAN do is make sure the resolution is fast and painless.\n\nYour trust matters to us more than any single order. I want to earn it back.' },
      { role: 'user', text: 'Well... that\'s actually a really good response. Thank you.' },
      { role: 'assistant', text: 'Of course. And I mean every word. I\'ll have the replacement shipped within the hour and follow up with you by end of day tomorrow with a tracking number. You shouldn\'t have to chase us on this.\n\nIs there anything else I can help with?' },
    ],
  },
  scheduling: {
    title: 'Smart Scheduling',
    icon: '\uD83D\uDCC5',
    color: '#3b82f6',
    messages: [
      { role: 'user', text: 'I need to book a consultation for this Saturday. We have investors visiting Monday and need to prepare.' },
      { role: 'assistant', text: 'Saturday \u2014 got it! Investor prep is serious business, and I\'m on it.\n\nI have morning slots (9-11 AM) and afternoon slots (1-3 PM) available. Which works better?\n\nSince you\'ve got investors on Monday, I\'d recommend the comprehensive approach:\n\u2022 Financial review & deck preparation\n\u2022 Talking points & objection handling\n\u2022 Facility walkthrough checklist\n\u2022 Materials & handout preparation\n\u2022 Mock Q&A session\n\nTrust me \u2014 investors notice preparation. They\'ll check the numbers first, then your confidence, then the details.' },
      { role: 'user', text: 'Morning slot please! You really do know the drill.' },
      { role: 'assistant', text: 'Booked! Saturday, 9 AM start. Estimated 2-3 hours for a thorough session.\n\nI\'ve added the investor-prep protocol notes to the agenda. We\'ll make sure everything is buttoned up.\n\nYou\'ll get a confirmation shortly and a reminder Friday evening. Good luck this weekend \u2014 you\'ve got this!' },
    ],
  },
  jokes: {
    title: 'Office Humor',
    icon: '\uD83D\uDE02',
    color: '#f59e0b',
    messages: [
      { role: 'user', text: 'I need a laugh. Got any jokes?' },
      { role: 'assistant', text: 'I\'m reading a book on anti-gravity. It\'s impossible to put down.\n\nWhy don\'t eggs tell jokes? They\'d crack each other up.\n\nI told my computer I needed a break. Now it won\'t stop sending KitKat ads.\n\nWhy did the spreadsheet go to therapy? It had too many issues.\n\nI can do this all day. Try me.' },
      { role: 'user', text: 'Give me an office work joke!' },
      { role: 'assistant', text: 'Oh you want the OCCUPATIONAL hazard collection? Say less:\n\nI tried to organize a productivity meeting but nobody could find the time.\n\nWhat did the printer say to the employee? "You\'re really pushing my buttons."\n\nWhy did the calendar break up with the clock? Their days were numbered.\n\nMy boss told me to have a good day, so I went home.\n\nWhat do you call a meeting that could have been an email? Every meeting.\n\nI\'ve got hundreds more where that came from. This is what happens when you give an AI unlimited joke storage.' },
    ],
  },
  business_ops: {
    title: 'Business Intelligence',
    icon: '\uD83D\uDCCA',
    color: '#a855f7',
    messages: [
      { role: 'user', text: 'I think the new hire Jessica might be underperforming. Something seems off with her numbers.' },
      { role: 'assistant', text: 'Your instinct is usually right. Let me pull the data.\n\nPerformance analysis for Jessica\'s recent activity:\n\u2022 She\'s been on the team for 3 weeks\n\u2022 Task completion rate: noticeably lower than team average\n\u2022 Specifically: project milestones (behind by 2.3x), response times (1.8x slower), client follow-ups (missing 8)\n\nPossible explanations:\n1. Underperformance \u2014 genuine skill gap\n2. Training gap \u2014 onboarding was too fast (common issue)\n3. Workload mismatch \u2014 her assignments may be above level\n\nMy recommendation: Before a difficult conversation, let\'s confirm. I can:\n\u2022 Run a detailed performance comparison over her next 3 work cycles\n\u2022 Cross-reference with the complexity of her assigned tasks\n\u2022 Check her onboarding completion status\n\nIf the numbers confirm underperformance after fair observation, we have documented evidence. If it\'s training, it\'s a fixable problem.\n\nLet the data speak. Give me 1 week and I\'ll have your answer.' },
      { role: 'user', text: 'That\'s exactly what I needed. Do it.' },
      { role: 'assistant', text: 'On it. I\'ve set up the tracking protocol:\n\n\u2714 Performance metrics flagged for comparison over next 3 cycles\n\u2714 Task difficulty ratings pulled for context\n\u2714 Onboarding checklist audit activated\n\nI\'ll have a full report with data, not assumptions. If action is needed, we\'ll have documentation that holds up.\n\nAnything else you need me watching?' },
    ],
  },
  emotional_iq: {
    title: 'Emotional Intelligence',
    icon: '\u2764\uFE0F',
    color: '#14b8a6',
    messages: [
      { role: 'user', text: 'Hi... I\'m going through a really tough time personally and I\'ve been falling behind on everything. I feel so overwhelmed and embarrassed to even ask for help.' },
      { role: 'assistant', text: 'First \u2014 please don\'t feel embarrassed. Not even a little bit. Life hits hard sometimes, and staying on top of everything during a rough patch is about item number 847 on anyone\'s priority list. You\'re dealing with so much right now, and reaching out for help is actually a sign of strength.\n\nHere\'s what I\'d suggest:\n\nLet\'s start by getting the most urgent items handled first. Think of it as a reset \u2014 for your workload AND for your peace of mind.\n\nA few things to put your mind at ease:\n\u2022 I\'m here to help, not judge. Zero judgment.\n\u2022 We can tackle this together at whatever pace works for you\n\u2022 I\'ll prioritize everything so you see quick wins first \u2014 sometimes small progress does wonders for your headspace\n\nAfter we handle the immediate items, we can set up a manageable schedule so you never fall behind again. One less thing to worry about.\n\nYou\'re going to get through this. And things are going to look a lot better once we knock out a few of these together.' },
    ],
  },
};

function ConversationSimulator() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('customer_service');
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const convo = DEMO_CONVERSATIONS[activeTab];

  useEffect(() => {
    setVisibleMessages(0);
    setIsTyping(false);
    let timeout: NodeJS.Timeout;
    const showNext = (index: number) => {
      if (index >= convo.messages.length) return;
      const delay = index === 0 ? 500 : convo.messages[index].role === 'assistant' ? 1200 : 800;
      timeout = setTimeout(() => {
        if (convo.messages[index].role === 'assistant') {
          setIsTyping(true);
          timeout = setTimeout(() => {
            setIsTyping(false);
            setVisibleMessages(index + 1);
            showNext(index + 1);
          }, Math.min(convo.messages[index].text.length * 8, 2000));
        } else {
          setVisibleMessages(index + 1);
          showNext(index + 1);
        }
      }, delay);
    };
    showNext(0);
    return () => clearTimeout(timeout);
  }, [activeTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages, isTyping]);

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
      {/* Tab Bar */}
      <div className="flex overflow-x-auto border-b" style={{ borderColor: 'var(--ept-border)' }}>
        {Object.entries(DEMO_CONVERSATIONS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2"
            style={{
              borderBottomColor: activeTab === key ? val.color : 'transparent',
              color: activeTab === key ? val.color : 'var(--ept-text-muted)',
              backgroundColor: activeTab === key ? (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)') : 'transparent',
            }}
          >
            <span>{val.icon}</span>
            <span className="hidden sm:inline">{val.title}</span>
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="p-4 md:p-6 h-[420px] overflow-y-auto" style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.01)' }}>
        <div className="space-y-4">
          {convo.messages.slice(0, visibleMessages).map((msg, i) => (
            <div key={`${activeTab}-${i}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: 'rgba(20,184,166,0.15)', color: 'var(--ept-accent)' }}>E</div>
                    <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo</span>
                  </div>
                )}
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                  style={{
                    backgroundColor: msg.role === 'user'
                      ? (isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.08)')
                      : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                    color: 'var(--ept-text)',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : undefined,
                    borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : undefined,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-fade-up">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: 'rgba(20,184,166,0.15)', color: 'var(--ept-accent)' }}>E</div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo</span>
                </div>
                <div className="px-4 py-3 rounded-2xl" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--ept-text-muted)', animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--ept-text-muted)', animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--ept-text-muted)', animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Replay Button */}
      <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--ept-border)' }}>
        <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          Live demo \u2014 this is how your AI assistant actually responds
        </span>
        <button
          onClick={() => { setVisibleMessages(0); setActiveTab(activeTab); }}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
          style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-accent)' }}
        >
          Replay
        </button>
      </div>
    </div>
  );
}

/* ==============================================================================
   TRAINING TUTORIAL
   ============================================================================== */

const TUTORIAL_STEPS = [
  {
    step: 1,
    title: 'Tell Echo About Your Business',
    subtitle: 'Initial Setup \u2014 5 minutes',
    description: 'Echo learns your company name, services, pricing, service area, team size, and brand voice. It adapts its personality to match your business culture.',
    illustration: 'SETUP',
    details: [
      'Company name & branding',
      'Services offered & pricing',
      'Service area coverage',
      'Team size & scheduling',
      'Brand voice & tone preferences',
    ],
  },
  {
    step: 2,
    title: 'Train It On Your Customers',
    subtitle: 'Customer Intelligence \u2014 10 minutes',
    description: 'Upload your FAQ, common complaints, and customer personas. Echo builds a knowledge base that grows smarter with every interaction.',
    illustration: 'CUSTOMERS',
    details: [
      'Import existing FAQs',
      'Define customer segments',
      'Set up complaint handling flows',
      'Configure VIP customer treatment',
      'Enable emotional intelligence mode',
    ],
  },
  {
    step: 3,
    title: 'Set Up Your Channels',
    subtitle: 'Multi-Channel Deployment \u2014 5 minutes',
    description: 'Connect Echo to your website chat, phone line, SMS, email, WhatsApp, Facebook Messenger, and more. One AI, every channel.',
    illustration: 'CHANNELS',
    details: [
      'Website chat widget (1-line embed)',
      'Phone system (Twilio / VoIP)',
      'SMS & text messaging',
      'Email auto-responder',
      'Social media DMs',
    ],
  },
  {
    step: 4,
    title: 'Customize the Personality',
    subtitle: 'Voice & Personality \u2014 3 minutes',
    description: 'Choose your AI\'s voice, humor level, formality, and response style. It can be warm and casual for a local business or polished and corporate for enterprise.',
    illustration: 'PERSONALITY',
    details: [
      'Voice selection (6 voices available)',
      'Humor level slider (Professional to Playful)',
      'Formality dial (Casual to Corporate)',
      'Emoji usage toggle',
      'Custom catchphrases & sign-offs',
    ],
  },
  {
    step: 5,
    title: 'Go Live & Watch It Work',
    subtitle: 'Launch \u2014 Instant',
    description: 'Echo starts handling customer inquiries, booking appointments, sending follow-ups, and managing your office \u2014 24/7, 365 days a year. You focus on your business.',
    illustration: 'LIVE',
    details: [
      'Real-time conversation dashboard',
      'Customer satisfaction scoring',
      'Automatic escalation to humans',
      'Daily performance reports',
      'Continuous learning from feedback',
    ],
  },
];

function TutorialIllustration({ type, isDark }: { type: string; isDark: boolean }) {
  const bg = isDark ? 'rgba(20,184,166,0.08)' : 'rgba(13,115,119,0.04)';
  const accent = 'var(--ept-accent)';
  const accentHex = isDark ? '#14b8a6' : '#0d7377';
  const secondary = isDark ? '#64748b' : '#94a3b8';

  const illustrations: Record<string, React.ReactNode> = {
    SETUP: (
      <div className="relative w-full h-48 rounded-xl overflow-hidden" style={{ backgroundColor: bg }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-3 w-64">
            {['Company Name', 'Services', 'Pricing'].map((label, i) => (
              <div key={label} className="flex items-center gap-2 animate-fade-up" style={{ animationDelay: `${i * 200}ms` }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: i < 2 ? '#22c55e' : accentHex }} />
                <div className="flex-1 h-8 rounded-lg border px-3 flex items-center text-xs" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
                  {label}
                </div>
                {i < 2 && <svg className="w-4 h-4" style={{ color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
            ))}
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: '66%', backgroundColor: accentHex }} />
            </div>
            <div className="text-[10px] text-center" style={{ color: secondary }}>Setup Progress: 66%</div>
          </div>
        </div>
      </div>
    ),
    CUSTOMERS: (
      <div className="relative w-full h-48 rounded-xl overflow-hidden" style={{ backgroundColor: bg }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-2 w-72">
            {[
              { emoji: '\uD83D\uDE0A', label: 'Happy', pct: '73%' },
              { emoji: '\uD83D\uDE20', label: 'Frustrated', pct: '15%' },
              { emoji: '\uD83E\uDD14', label: 'Curious', pct: '12%' },
              { emoji: '\u2B50', label: 'VIP', pct: '8%' },
              { emoji: '\uD83C\uDD95', label: 'New', pct: '42%' },
              { emoji: '\uD83D\uDD01', label: 'Returning', pct: '58%' },
            ].map((item, i) => (
              <div key={item.label} className="p-2 rounded-lg border text-center animate-fade-up" style={{ borderColor: 'var(--ept-border)', animationDelay: `${i * 100}ms` }}>
                <div className="text-lg">{item.emoji}</div>
                <div className="text-[10px] font-semibold" style={{ color: 'var(--ept-text-muted)' }}>{item.label}</div>
                <div className="text-xs font-bold" style={{ color: accentHex }}>{item.pct}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    CHANNELS: (
      <div className="relative w-full h-48 rounded-xl overflow-hidden" style={{ backgroundColor: bg }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2" style={{ borderColor: accentHex, backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,115,119,0.08)' }}>
              E
            </div>
            {[
              { icon: '\uD83D\uDCAC', angle: 0, label: 'Chat' },
              { icon: '\uD83D\uDCDE', angle: 60, label: 'Phone' },
              { icon: '\uD83D\uDCE7', angle: 120, label: 'Email' },
              { icon: '\uD83D\uDCF1', angle: 180, label: 'SMS' },
              { icon: '\uD83D\uDCAD', angle: 240, label: 'Social' },
              { icon: '\uD83C\uDF10', angle: 300, label: 'Web' },
            ].map((ch, i) => {
              const r = 70;
              const x = Math.cos((ch.angle * Math.PI) / 180) * r;
              const y = Math.sin((ch.angle * Math.PI) / 180) * r;
              return (
                <div
                  key={ch.label}
                  className="absolute w-10 h-10 rounded-full flex items-center justify-center text-sm border animate-fade-up"
                  style={{
                    left: `calc(50% + ${x}px - 20px)`,
                    top: `calc(50% + ${y}px - 20px)`,
                    borderColor: 'var(--ept-border)',
                    backgroundColor: 'var(--ept-card-bg)',
                    animationDelay: `${i * 150}ms`,
                  }}
                  title={ch.label}
                >
                  {ch.icon}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ),
    PERSONALITY: (
      <div className="relative w-full h-48 rounded-xl overflow-hidden" style={{ backgroundColor: bg }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-3 w-56">
            {[
              { label: 'Warmth', value: 85 },
              { label: 'Humor', value: 70 },
              { label: 'Formality', value: 40 },
              { label: 'Empathy', value: 95 },
            ].map((slider, i) => (
              <div key={slider.label} className="animate-fade-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span style={{ color: 'var(--ept-text-muted)' }}>{slider.label}</span>
                  <span style={{ color: accentHex }}>{slider.value}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${slider.value}%`, backgroundColor: accentHex }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    LIVE: (
      <div className="relative w-full h-48 rounded-xl overflow-hidden" style={{ backgroundColor: bg }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-2 w-64">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold" style={{ color: '#22c55e' }}>LIVE</span>
              </div>
              <span className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>Today</span>
            </div>
            {[
              { metric: 'Conversations', value: '47', trend: '+12%' },
              { metric: 'Appointments Booked', value: '8', trend: '+23%' },
              { metric: 'Satisfaction Score', value: '4.9/5', trend: '+0.2' },
              { metric: 'Avg Response Time', value: '1.2s', trend: '-0.3s' },
            ].map((m, i) => (
              <div key={m.metric} className="flex items-center justify-between p-2 rounded-lg border animate-fade-up" style={{ borderColor: 'var(--ept-border)', animationDelay: `${i * 100}ms` }}>
                <span className="text-[11px]" style={{ color: 'var(--ept-text-secondary)' }}>{m.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: 'var(--ept-text)' }}>{m.value}</span>
                  <span className="text-[10px] font-semibold" style={{ color: '#22c55e' }}>{m.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  };

  return illustrations[type] || null;
}

function TrainingTutorial() {
  const { isDark } = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const accentHex = isDark ? '#14b8a6' : '#0d7377';

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-6">
      {/* Step Navigation */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {TUTORIAL_STEPS.map((step, i) => (
          <button
            key={step.step}
            onClick={() => setActiveStep(i)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all whitespace-nowrap md:whitespace-normal min-w-[200px] md:min-w-0"
            style={{
              backgroundColor: activeStep === i
                ? (isDark ? 'rgba(20,184,166,0.1)' : 'rgba(13,115,119,0.06)')
                : 'transparent',
              borderLeft: activeStep === i ? `3px solid ${accentHex}` : '3px solid transparent',
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                backgroundColor: activeStep === i ? accentHex : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
                color: activeStep === i ? '#fff' : 'var(--ept-text-muted)',
              }}
            >
              {step.step}
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: activeStep === i ? accentHex : 'var(--ept-text-secondary)' }}>
                {step.title}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>{step.subtitle}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.12)' : 'rgba(13,115,119,0.08)', color: accentHex }}>
              Step {TUTORIAL_STEPS[activeStep].step}
            </span>
            <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
              {TUTORIAL_STEPS[activeStep].subtitle}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>
            {TUTORIAL_STEPS[activeStep].title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
            {TUTORIAL_STEPS[activeStep].description}
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-4">
          <TutorialIllustration type={TUTORIAL_STEPS[activeStep].illustration} isDark={isDark} />
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {TUTORIAL_STEPS[activeStep].details.map((detail, i) => (
            <div key={detail} className="flex items-center gap-2 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{detail}</span>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t" style={{ borderColor: 'var(--ept-border)' }}>
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="text-sm font-medium px-4 py-2 rounded-lg transition-opacity disabled:opacity-30"
            style={{ color: 'var(--ept-text-secondary)' }}
          >
            Previous
          </button>
          <button
            onClick={() => setActiveStep(Math.min(TUTORIAL_STEPS.length - 1, activeStep + 1))}
            disabled={activeStep === TUTORIAL_STEPS.length - 1}
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity disabled:opacity-30"
            style={{ backgroundColor: accentHex }}
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================================
   ROI CALCULATOR
   ============================================================================== */

function ROICalculator() {
  const { isDark } = useTheme();
  const [employees, setEmployees] = useState(2);
  const [hourlyRate, setHourlyRate] = useState(18);
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  const [callsPerDay, setCallsPerDay] = useState(20);

  const accentHex = isDark ? '#14b8a6' : '#0d7377';
  const monthlyCost = employees * hourlyRate * hoursPerWeek * 4.33;
  const echoCost = 149;
  const savings = monthlyCost - echoCost;
  const savingsPercent = monthlyCost > 0 ? Math.round((savings / monthlyCost) * 100) : 0;
  const annualSavings = savings * 12;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Inputs */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--ept-text)' }}>Your Current Costs</h3>
        {[
          { label: 'Office staff handling calls/chat', value: employees, setter: setEmployees, min: 1, max: 20, unit: 'people' },
          { label: 'Average hourly rate', value: hourlyRate, setter: setHourlyRate, min: 10, max: 50, unit: '$/hr' },
          { label: 'Hours per week on admin/calls', value: hoursPerWeek, setter: setHoursPerWeek, min: 5, max: 40, unit: 'hrs/wk' },
          { label: 'Customer inquiries per day', value: callsPerDay, setter: setCallsPerDay, min: 5, max: 100, unit: '/day' },
        ].map((input) => (
          <div key={input.label}>
            <div className="flex justify-between mb-2">
              <label className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{input.label}</label>
              <span className="text-sm font-bold font-mono" style={{ color: accentHex }}>{input.value} {input.unit}</span>
            </div>
            <input
              type="range"
              min={input.min}
              max={input.max}
              value={input.value}
              onChange={(e) => input.setter(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${accentHex} 0%, ${accentHex} ${((input.value - input.min) / (input.max - input.min)) * 100}%, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'} ${((input.value - input.min) / (input.max - input.min)) * 100}%, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'} 100%)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="p-6 rounded-2xl border" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.05)' : 'rgba(13,115,119,0.03)', borderColor: isDark ? 'rgba(20,184,166,0.2)' : 'rgba(13,115,119,0.15)' }}>
        <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--ept-text)' }}>With Echo Office AI</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--ept-border)' }}>
            <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Current monthly cost</span>
            <span className="text-lg font-bold font-mono line-through" style={{ color: 'var(--ept-text-muted)' }}>${Math.round(monthlyCost).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--ept-border)' }}>
            <span className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Echo Office AI monthly cost</span>
            <span className="text-lg font-bold font-mono" style={{ color: '#22c55e' }}>${echoCost}/mo</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: 'var(--ept-border)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>Monthly savings</span>
            <span className="text-2xl font-extrabold font-mono" style={{ color: '#22c55e' }}>${Math.round(savings).toLocaleString()}</span>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: isDark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.06)' }}>
            <div className="text-3xl font-extrabold font-mono mb-1" style={{ color: '#22c55e' }}>
              ${Math.round(annualSavings).toLocaleString()}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#22c55e' }}>
              Annual Savings ({savingsPercent}% reduction)
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
              <div className="text-lg font-bold" style={{ color: accentHex }}>24/7</div>
              <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>Availability</div>
            </div>
            <div className="text-center p-3 rounded-lg" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
              <div className="text-lg font-bold" style={{ color: accentHex }}>{callsPerDay * 30}+</div>
              <div className="text-[10px]" style={{ color: 'var(--ept-text-muted)' }}>Inquiries/mo handled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================================
   COMPARISON TABLE DATA
   ============================================================================== */

const COMPARE_DATA = [
  { feature: 'Monthly Cost', echo: 'From $149', others: '$2,000-$4,000' },
  { feature: 'Setup Time', echo: '< 1 hour', others: '2-4 weeks' },
  { feature: 'Available Hours', echo: '24/7/365', others: 'Business hours' },
  { feature: 'Emotional Intelligence', echo: '6-tier adaptive', others: 'Script-based' },
  { feature: 'Customer Memory', echo: 'Infinite recall', others: 'Session-only' },
  { feature: 'Humor & Personality', echo: '200K+ jokes, adaptive', others: 'None' },
  { feature: 'Channels Supported', echo: '7+ simultaneous', others: '1-2 channels' },
  { feature: 'Business Analytics', echo: 'Built-in real-time', others: 'Separate tool needed' },
  { feature: 'Voice Conversations', echo: 'Natural AI voice', others: 'Text-only' },
  { feature: 'Custom Training', echo: 'Your business, your data', others: 'Generic templates' },
  { feature: 'Appointment Booking', echo: 'Intelligent scheduling', others: 'Basic calendar links' },
  { feature: 'Escalation to Human', echo: 'Context-aware handoff', others: 'Cold transfer' },
];

/* ==============================================================================
   INDUSTRIES
   ============================================================================== */

const INDUSTRIES = [
  'Cleaning Services', 'Property Management', 'Real Estate', 'Legal Offices', 'Medical Practices',
  'Dental Offices', 'Salons & Spas', 'HVAC Companies', 'Plumbing', 'Landscaping',
  'Roofing', 'Insurance Agencies', 'Accounting Firms', 'Consulting', 'Fitness Studios',
  'Auto Repair', 'Pet Services', 'Restaurants', 'Photography', 'Event Planning',
];

/* ==============================================================================
   PRICING
   ============================================================================== */

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
    description: 'Unlimited everything \u2014 Conversational AI, business operations, white-label branding, and enterprise guarantees.',
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

/* ==============================================================================
   MAIN PAGE COMPONENT
   ============================================================================== */

export default function OfficeAIPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const featSection = useInView();
  const howSection = useInView();
  const priceSection = useInView();
  const ctaSection = useInView();
  const demoSection = useInView(0.1);
  const tutorialSection = useInView(0.1);
  const roiSection = useInView(0.1);
  const compareSection = useInView(0.1);

  const [voiceActive, setVoiceActive] = useState(false);

  // Website Builder Form
  const [webFormOpen, setWebFormOpen] = useState(false);
  const [webForm, setWebForm] = useState({
    businessName: '',
    businessType: '',
    email: '',
    phone: '',
    pages: ['Home', 'About', 'Services', 'Contact'] as string[],
    features: [] as string[],
    domain: '',
    notes: '',
  });
  const [webFormSent, setWebFormSent] = useState(false);

  const WEB_PAGE_OPTIONS = ['Home', 'About', 'Services', 'Contact', 'Pricing', 'Gallery', 'Blog', 'Testimonials', 'FAQ', 'Team', 'Careers', 'Portfolio'];
  const WEB_FEATURE_OPTIONS = [
    'AI Chat Widget', 'Online Booking', 'Payment Processing', 'Contact Form', 'Email Capture',
    'SEO Optimization', 'Google Analytics', 'Social Media Links', 'Photo Gallery', 'Video Embed',
    'Customer Reviews', 'Google Maps', 'Live Chat', 'Newsletter Signup', 'Dark/Light Theme',
    'Mobile-First Design', 'Custom Domain', 'SSL Certificate',
  ];

  const toggleWebPage = (page: string) => {
    setWebForm(f => ({ ...f, pages: f.pages.includes(page) ? f.pages.filter(p => p !== page) : [...f.pages, page] }));
  };
  const toggleWebFeature = (feat: string) => {
    setWebForm(f => ({ ...f, features: f.features.includes(feat) ? f.features.filter(p => p !== feat) : [...f.features, feat] }));
  };

  const submitWebForm = () => {
    if (!webForm.businessName || !webForm.email) return;
    const subject = encodeURIComponent(`Website Build Request — ${webForm.businessName}`);
    const body = encodeURIComponent(
      `Business: ${webForm.businessName}\nType: ${webForm.businessType}\nEmail: ${webForm.email}\nPhone: ${webForm.phone}\nDomain: ${webForm.domain || 'Need one'}\n\nPages: ${webForm.pages.join(', ')}\n\nFeatures: ${webForm.features.join(', ')}\n\nNotes: ${webForm.notes}`
    );
    window.open(`mailto:bob@echo-op.com?subject=${subject}&body=${body}`, '_blank');
    setWebFormSent(true);
  };

  const accentHex = isDark ? '#14b8a6' : '#0d7377';

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
      {/* --- Nav --- */}
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

      {/* --- Hero --- */}
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
              AI phone answering, receptionist, call transcription, outbound calls, SMS &mdash; plus invoicing, bookings, fleet management, and analytics. One platform for every business you run.
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

          {/* --- Key Metrics --- */}
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

      {/* --- Conversational AI Features --- */}
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
              AI answers your calls, books appointments, sends texts, makes outbound calls, and scores every interaction &mdash; so you never miss a customer and never miss an insight.
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

      {/* --- Live AI Demo --- */}
      <section id="demo" className="py-24 px-6" style={{ backgroundColor: 'var(--ept-surface)' }} ref={demoSection.ref}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Live Demo</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--ept-text)' }}>
              See Your AI In <span className="gradient-text">Action</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              These are real conversations your AI assistant handles every day. Click each tab to see how it adapts its personality, tone, and expertise to every situation.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Conversation Simulator */}
            <ConversationSimulator />

            {/* Voice Widget Panel */}
            <div
              className="p-6 rounded-2xl border flex flex-col"
              style={{
                backgroundColor: 'var(--ept-card-bg)',
                borderColor: isDark ? 'rgba(20,184,166,0.3)' : 'rgba(13,115,119,0.15)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(20,184,166,0.12)' : 'rgba(13,115,119,0.08)' }}>
                  <svg className="w-5 h-5" style={{ color: 'var(--ept-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--ept-accent)' }}>Try Live AI Voice</h3>
                  <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Have a real voice conversation</p>
                </div>
              </div>

              {!voiceActive ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                  <p className="mb-6 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    Click below to activate voice mode. A microphone bubble will appear in the bottom-right corner. Have a real conversation &mdash; ask about your business needs, request a joke, or test the emotional intelligence.
                  </p>
                  <button
                    onClick={() => setVoiceActive(true)}
                    className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: 'var(--ept-accent)', boxShadow: `0 8px 24px ${isDark ? 'rgba(20,184,166,0.3)' : 'rgba(13,115,119,0.2)'}` }}
                  >
                    Activate Voice Demo
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ept-accent)' }} />
                    <span className="text-sm font-bold" style={{ color: 'var(--ept-accent)' }}>VOICE ACTIVE</span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>Look for the microphone bubble in the bottom-right corner. It may take a moment to load.</p>
                  <button
                    onClick={() => setVoiceActive(false)}
                    className="px-4 py-2 rounded-lg border text-sm transition-opacity hover:opacity-70"
                    style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#ef4444' }}
                  >
                    End Voice Demo
                  </button>
                </div>
              )}
            </div>
          </div>
          {voiceActive && <AIVoiceWidget active={voiceActive} />}
        </div>
      </section>

      {/* --- Office Management Features --- */}
      <section data-tutorial="office-tools" className="py-24 px-6">
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

      {/* --- Business Operations Features --- */}
      <section className="py-24 px-6" style={{ backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Business Operations</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--ept-text)' }}>
              Run the whole business.
              <br />
              <span className="gradient-text">Not just the office.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
              Inventory, payroll, timesheets, AR/AP, employee management, and reputation monitoring &mdash; everything a service business needs to operate, all in one platform.
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

      {/* --- Setup Tutorial --- */}
      <section className="py-24 px-6" ref={tutorialSection.ref}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Getting Started</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--ept-text)' }}>
              Set Up in <span className="gradient-text">Under 30 Minutes</span>
            </h2>
            <p className="text-lg" style={{ color: 'var(--ept-text-secondary)' }}>
              Interactive walkthrough &mdash; click each step to see exactly what happens.
            </p>
          </div>
          <TrainingTutorial />
        </div>
      </section>

      {/* --- ROI Calculator --- */}
      <section className="py-24 px-6" style={{ backgroundColor: 'var(--ept-surface)' }} ref={roiSection.ref}>
        <div className="max-w-6xl mx-auto">
          <div className="p-8 md:p-12 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-center mb-8">
              <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>ROI Calculator</div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--ept-text)' }}>
                Calculate Your <span className="gradient-text">Savings</span>
              </h2>
              <p style={{ color: 'var(--ept-text-secondary)' }}>
                Drag the sliders to see how much Echo Office AI saves your business.
              </p>
            </div>
            <ROICalculator />
          </div>
        </div>
      </section>

      {/* --- Comparison Table --- */}
      <section className="py-24 px-6" ref={compareSection.ref}>
        <div className="max-w-6xl mx-auto">
          <div className="p-6 md:p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <div className="text-center mb-8">
              <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Comparison</div>
              <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
                Echo Office AI vs. Traditional Staff & Chatbots
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--ept-border)' }}>
                    <th className="text-left py-3 font-medium" style={{ color: 'var(--ept-text-muted)' }}>Feature</th>
                    <th className="text-center py-3 font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>Echo Office AI</th>
                    <th className="text-center py-3 font-medium text-xs uppercase tracking-wider" style={{ color: 'var(--ept-text-muted)' }}>Others</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_DATA.map((row) => (
                    <tr key={row.feature} style={{ borderBottom: `1px solid ${isDark ? 'rgba(30,41,59,0.5)' : 'rgba(226,232,240,0.5)'}` }}>
                      <td className="py-3" style={{ color: 'var(--ept-text-secondary)' }}>{row.feature}</td>
                      <td className="py-3 text-center font-bold" style={{ color: '#22c55e' }}>{row.echo}</td>
                      <td className="py-3 text-center" style={{ color: 'var(--ept-text-muted)' }}>{row.others}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* --- How It Works --- */}
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

      {/* --- Industries We Serve --- */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Industries</div>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--ept-text)' }}>Built For Every Service Business</h2>
            <p className="text-sm mt-2" style={{ color: 'var(--ept-text-muted)' }}>Echo adapts to your industry, your terminology, and your customers.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {INDUSTRIES.map((industry) => (
              <div
                key={industry}
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

      {/* --- Website Builder Service --- */}
      <section id="website-builder" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--ept-accent)' }}>Add-On Service</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--ept-text)' }}>
              We&apos;ll Build Your <span className="gradient-text">Business Website</span>
            </h2>
            <p className="mt-5 text-lg max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>
              Every Office AI customer gets a professional website built by our team — with AI chat, online booking, and all your services integrated. Tell us what you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { tier: 'Starter Site', price: '$499', desc: 'Up to 5 pages, mobile-responsive, contact form, SEO setup, and your Office AI chat widget embedded. Delivered in 3 days.', features: ['5 pages', 'Mobile-first', 'Contact form', 'SEO basics', 'AI Chat Widget'] },
              { tier: 'Professional Site', price: '$999', desc: 'Up to 12 pages, booking integration, payment processing, gallery, reviews, analytics, and full Office AI integration. Delivered in 5 days.', features: ['12 pages', 'Online booking', 'Payments', 'Gallery + Reviews', 'Google Analytics', 'Full AI integration'] },
              { tier: 'Custom Build', price: 'Custom', desc: 'Complex sites, e-commerce, portals, multi-location — whatever you need. White-label, API integrations, custom functionality.', features: ['Unlimited pages', 'E-commerce', 'Custom portal', 'API integrations', 'White-label', 'Dedicated support'] },
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: i === 1 ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: i === 1 ? 2 : 1 }}>
                {i === 1 && <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--ept-accent)' }}>Most Popular</div>}
                <h3 className="text-lg font-bold" style={{ color: 'var(--ept-text)' }}>{t.tier}</h3>
                <div className="text-3xl font-extrabold gradient-text my-2">{t.price}</div>
                <p className="text-sm mb-4" style={{ color: 'var(--ept-text-muted)' }}>{t.desc}</p>
                <ul className="space-y-2 mb-6">
                  {t.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                      <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setWebFormOpen(true)} className="w-full py-2.5 rounded-xl font-semibold text-sm" style={{ backgroundColor: i === 1 ? 'var(--ept-accent)' : 'transparent', color: i === 1 ? '#fff' : 'var(--ept-accent)', border: i === 1 ? 'none' : '1px solid var(--ept-accent)' }}>
                  Request a Quote
                </button>
              </div>
            ))}
          </div>

          {/* Request Form */}
          {webFormOpen && !webFormSent && (
            <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: 2 }}>
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--ept-text)' }}>Tell Us About Your Website</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Business Name *</label>
                  <input type="text" value={webForm.businessName} onChange={e => setWebForm(f => ({ ...f, businessName: e.target.value }))} placeholder="My Business" className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Business Type</label>
                  <input type="text" value={webForm.businessType} onChange={e => setWebForm(f => ({ ...f, businessType: e.target.value }))} placeholder="Cleaning, HVAC, Law Firm..." className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Email *</label>
                  <input type="email" value={webForm.email} onChange={e => setWebForm(f => ({ ...f, email: e.target.value }))} placeholder="you@company.com" className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Phone</label>
                  <input type="tel" value={webForm.phone} onChange={e => setWebForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 123-4567" className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Domain (if you have one)</label>
                  <input type="text" value={webForm.domain} onChange={e => setWebForm(f => ({ ...f, domain: e.target.value }))} placeholder="mybusiness.com or leave blank" className="w-full px-3 py-2.5 rounded-xl text-sm border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--ept-text-muted)' }}>Pages You Want</label>
                <div className="flex flex-wrap gap-2">
                  {WEB_PAGE_OPTIONS.map(p => (
                    <button key={p} onClick={() => toggleWebPage(p)} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all" style={{ backgroundColor: webForm.pages.includes(p) ? (isDark ? '#14b8a620' : '#0d737715') : 'transparent', borderColor: webForm.pages.includes(p) ? 'var(--ept-accent)' : 'var(--ept-border)', color: webForm.pages.includes(p) ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}>
                      {webForm.pages.includes(p) ? '\u2713 ' : ''}{p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--ept-text-muted)' }}>Features & Integrations</label>
                <div className="flex flex-wrap gap-2">
                  {WEB_FEATURE_OPTIONS.map(f => (
                    <button key={f} onClick={() => toggleWebFeature(f)} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all" style={{ backgroundColor: webForm.features.includes(f) ? (isDark ? '#14b8a620' : '#0d737715') : 'transparent', borderColor: webForm.features.includes(f) ? 'var(--ept-accent)' : 'var(--ept-border)', color: webForm.features.includes(f) ? 'var(--ept-accent)' : 'var(--ept-text-muted)' }}>
                      {webForm.features.includes(f) ? '\u2713 ' : ''}{f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--ept-text-muted)' }}>Anything Else?</label>
                <textarea value={webForm.notes} onChange={e => setWebForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Special requests, brand colors, example sites you like..." className="w-full px-3 py-2.5 rounded-xl text-sm border resize-none" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text)' }} />
              </div>

              <div className="flex items-center gap-4">
                <button onClick={submitWebForm} disabled={!webForm.businessName || !webForm.email} className="px-8 py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-50" style={{ backgroundColor: 'var(--ept-accent)' }}>
                  Submit Request
                </button>
                <button onClick={() => setWebFormOpen(false)} className="text-sm" style={{ color: 'var(--ept-text-muted)' }}>Cancel</button>
                <span className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>{webForm.pages.length} pages selected &middot; {webForm.features.length} features</span>
              </div>
            </div>
          )}

          {webFormSent && (
            <div className="p-8 rounded-2xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)' }}>
              <div className="text-4xl mb-4">&#x2705;</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Request Submitted!</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>We&apos;ll review your requirements and get back to you within 24 hours with a quote and timeline.</p>
              <button onClick={() => { setWebFormSent(false); setWebFormOpen(false); }} className="mt-4 text-sm underline" style={{ color: 'var(--ept-accent)' }}>Submit Another Request</button>
            </div>
          )}
        </div>
      </section>

      {/* --- Pricing --- */}
      <section data-tutorial="office-pricing" id="pricing" className="py-24 px-6" style={{ backgroundColor: 'var(--ept-surface)' }} ref={priceSection.ref}>
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

      {/* --- CTA --- */}
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

      {/* --- Engine Query Panel --- */}
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

      {/* --- Footer --- */}
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
