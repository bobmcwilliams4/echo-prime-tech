'use client';

import { useEffect, useRef, useState } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon?: React.ReactNode;
  color?: string;
  trend?: number;
  chart?: number[];
}

export default function StatCard({ label, value, prefix = '', suffix = '', decimals = 0, icon, color, trend, chart }: StatCardProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 800;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(eased * value);
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  const formatted = `${prefix}${display.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

  return (
    <div ref={ref} className="glass-card p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ept-text-muted)' }}>
          {label}
        </span>
        {icon && <span style={{ color: color || 'var(--ept-accent)' }}>{icon}</span>}
      </div>
      <div className="text-2xl font-bold" style={{ color: color || 'var(--ept-text)' }}>
        {formatted}
      </div>
      {(trend !== undefined || chart) && (
        <div className="flex items-center gap-3">
          {trend !== undefined && (
            <span className="text-xs font-medium" style={{ color: trend >= 0 ? 'var(--ept-success)' : 'var(--ept-danger)' }}>
              {trend >= 0 ? '\u2191' : '\u2193'} {Math.abs(trend).toFixed(1)}%
            </span>
          )}
          {chart && chart.length > 1 && <MiniSparkline data={chart} color={color || 'var(--ept-accent)'} />}
        </div>
      )}
    </div>
  );
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const w = 80;
  const h = 24;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const id = `spark-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${points.join(' ')} ${w},${h}`} fill={`url(#${id})`} />
      <polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
