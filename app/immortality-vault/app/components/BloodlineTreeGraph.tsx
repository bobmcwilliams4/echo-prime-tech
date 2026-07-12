'use client';

/**
 * BloodlineTreeGraph - Immortality Vault pedigree chart.
 *
 * Layout math:
 *   - Cards are fixed 150x64. Generation g occupies one horizontal row.
 *   - Root (g = 0) sits at the BOTTOM; ancestors rise upward, so
 *     rowY(g) = PAD + (G - 1 - g) * (CARD_H + V_GAP).
 *   - Each row is centered against the widest row:
 *     rowX0 = PAD + (maxRowW - rowW) / 2, node i at rowX0 + i * (CARD_W + H_GAP).
 *   - Step/adoptive cards stack in a side column to the RIGHT of the root,
 *     vertically centered on it, joined by dashed connectors.
 *   - Pan/zoom is a single <g transform="translate(x,y) scale(k)">, driven by
 *     pointer + wheel handlers (no libraries). Initial transform fits content.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { BloodlineNode } from '../lib/vault-api';

interface Props {
  generations: BloodlineNode[][];
  parentsOf: Map<string, string[]>;
  stepFamily: { node: BloodlineNode; subtype: string }[];
  userId: string | null;
  photoUrl: (photoRecordId: string) => string;
  onSelect: (personKey: string) => void;
}

const PALETTE = {
  bg: '#0a0807',
  card: '#14100c',
  cardElevated: '#1c1710',
  gold: '#f5c451',
  goldBright: '#ffe08a',
  goldDeep: '#c69749',
  ivory: '#f0e7d6',
  muted: '#a99e8b',
  hairline: 'rgba(245,196,81,0.16)',
};

const CONFIDENCE_COLOR: Record<string, string> = {
  CONFIRMED_PRIMARY_SOURCE: '#34d399',
  CONFIRMED_SECONDARY_SOURCE: '#4ade80',
  CONFIRMED_FAMILY_TESTIMONY: '#22d3ee',
  PROBABLE: '#f5c451',
  POSSIBLE: '#fb923c',
  UNCONFIRMED: '#a99e8b',
  REFUTED: '#f87171',
};

const SERIF = `Georgia, 'Times New Roman', serif`;
const SANS = `'Segoe UI', system-ui, -apple-system, sans-serif`;

const CARD_W = 150;
const CARD_H = 64;
const H_GAP = 36; // gap between siblings in a row
const V_GAP = 92; // vertical gap between generations
const PAD = 56; // content padding inside the chart coordinate space
const STEP_GAP_X = 120; // horizontal reach of the step-family column
const STEP_GAP_Y = 26; // vertical gap between stacked step cards
const MIN_K = 0.4;
const MAX_K = 2.5;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function yearOf(date: string | null | undefined): string | null {
  const m = date ? date.match(/\d{4}/) : null;
  return m ? m[0] : null;
}

function lifespan(n: BloodlineNode): string {
  const b = yearOf(n.birth_date);
  const d = yearOf(n.death_date);
  if (n.living) return b ? `b. ${b}` : 'living';
  if (b && d) return `${b} \u2013 ${d}`;
  if (b) return `b. ${b}`;
  if (d) return `d. ${d}`;
  return 'dates unknown';
}

function monogram(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function truncate(s: string, max = 14): string {
  return s.length > max ? s.slice(0, max - 1).trimEnd() + '\u2026' : s;
}

interface Placed {
  node: BloodlineNode;
  x: number;
  y: number;
}

interface StepPlaced extends Placed {
  subtype: string;
}

interface Transform {
  x: number;
  y: number;
  k: number;
}

export default function BloodlineTreeGraph({
  generations,
  parentsOf,
  stepFamily,
  userId,
  photoUrl,
  onSelect,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [t, setT] = useState<Transform>({ x: 0, y: 0, k: 1 });
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const tRef = useRef(t);
  tRef.current = t;

  const sizeRef = useRef({ w: 0, h: 0 });
  const didFit = useRef(false);
  const drag = useRef<{ px: number; py: number; tx: number; ty: number } | null>(null);
  const movedRef = useRef(0);
  const [dragging, setDragging] = useState(false);

  const hasContent = generations.length > 0 && generations.some((row) => row.length > 0);

  // ---- Layout: positions for every blood node, step cards, edges, bounds ----
  const layout = useMemo(() => {
    const pos = new Map<string, Placed>();
    const G = generations.length;
    const rowWidths = generations.map(
      (row) => row.length * CARD_W + Math.max(0, row.length - 1) * H_GAP
    );
    const maxRowW = Math.max(CARD_W, ...rowWidths);

    generations.forEach((row, g) => {
      const x0 = PAD + (maxRowW - rowWidths[g]) / 2;
      const y = PAD + (G - 1 - g) * (CARD_H + V_GAP);
      row.forEach((node, i) => {
        pos.set(node.person_key, { node, x: x0 + i * (CARD_W + H_GAP), y });
      });
    });

    // Blood edges: child top-center rises to each parent's bottom-center.
    const edges: { d: string }[] = [];
    pos.forEach((child, key) => {
      (parentsOf.get(key) || []).forEach((pk) => {
        const parent = pos.get(pk);
        if (!parent) return;
        const cx = child.x + CARD_W / 2;
        const cy = child.y; // top edge of the child card
        const px = parent.x + CARD_W / 2;
        const py = parent.y + CARD_H; // bottom edge of the parent card
        const midY = (cy + py) / 2;
        edges.push({ d: `M ${cx} ${cy} C ${cx} ${midY}, ${px} ${midY}, ${px} ${py}` });
      });
    });

    // Step family: a side column to the right of the root, vertically centered.
    const root = generations[0] && generations[0][0];
    const rootPos = root ? pos.get(root.person_key) : undefined;
    const steps: StepPlaced[] = [];
    if (rootPos && stepFamily.length > 0) {
      const stackH = stepFamily.length * CARD_H + (stepFamily.length - 1) * STEP_GAP_Y;
      const startY = rootPos.y + CARD_H / 2 - stackH / 2;
      stepFamily.forEach((s, i) => {
        steps.push({
          node: s.node,
          subtype: s.subtype,
          x: rootPos.x + CARD_W + STEP_GAP_X,
          y: startY + i * (CARD_H + STEP_GAP_Y),
        });
      });
    }

    const stepEdges: { d: string }[] = [];
    if (rootPos) {
      steps.forEach((s) => {
        const sx = rootPos.x + CARD_W;
        const sy = rootPos.y + CARD_H / 2;
        const ex = s.x;
        const ey = s.y + CARD_H / 2;
        const midX = (sx + ex) / 2;
        stepEdges.push({ d: `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ey}, ${ex} ${ey}` });
      });
    }

    // Content bounds (for fit-to-content).
    let maxX = PAD + maxRowW;
    let maxY = PAD + Math.max(1, G) * CARD_H + Math.max(0, G - 1) * V_GAP;
    steps.forEach((s) => {
      maxX = Math.max(maxX, s.x + CARD_W);
      maxY = Math.max(maxY, s.y + CARD_H);
    });
    return { pos, edges, steps, stepEdges, contentW: maxX + PAD, contentH: maxY + PAD };
  }, [generations, parentsOf, stepFamily]);

  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  const fitTransform = (cw: number, ch: number): Transform => {
    const { contentW, contentH } = layoutRef.current;
    const raw = Math.min(cw / contentW, ch / contentH) * 0.96;
    const k = clamp(Math.min(raw, 1), MIN_K, MAX_K);
    return { k, x: (cw - contentW * k) / 2, y: (ch - contentH * k) / 2 };
  };

  // Measure the wrapper; run the initial fit once a real size is known.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      sizeRef.current = { w: width, h: height };
      if (!didFit.current && width > 0 && height > 0) {
        didFit.current = true;
        setT(fitTransform(width, height));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wheel zoom must be a non-passive native listener to preventDefault.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const cur = tRef.current;
      const nk = clamp(cur.k * Math.exp(-e.deltaY * 0.0015), MIN_K, MAX_K);
      const r = nk / cur.k;
      setT({ k: nk, x: px - (px - cur.x) * r, y: py - (py - cur.y) * r });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const zoomBy = (factor: number) => {
    const { w, h } = sizeRef.current;
    const cur = tRef.current;
    const nk = clamp(cur.k * factor, MIN_K, MAX_K);
    const r = nk / cur.k;
    setT({ k: nk, x: w / 2 - (w / 2 - cur.x) * r, y: h / 2 - (h / 2 - cur.y) * r });
  };

  const reset = () => {
    const { w, h } = sizeRef.current;
    if (w > 0 && h > 0) setT(fitTransform(w, h));
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (drag.current) return; // single-pointer pan only
    (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, tx: tRef.current.x, ty: tRef.current.y };
    movedRef.current = 0;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.px;
    const dy = e.clientY - d.py;
    movedRef.current = Math.max(movedRef.current, Math.abs(dx) + Math.abs(dy));
    setT({ k: tRef.current.k, x: d.tx + dx, y: d.ty + dy });
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const handleSelect = (personKey: string) => {
    if (movedRef.current > 5) return; // it was a pan, not a click
    onSelect(personKey);
  };

  const renderCard = (placed: Placed, idKey: string, subtype?: string) => {
    const { node, x, y } = placed;
    const hovered = hoverKey === node.person_key;
    const dot = CONFIDENCE_COLOR[node.confidence] || '#a99e8b';
    const pillText = subtype ? subtype.toUpperCase() : null;
    const pillW = pillText ? pillText.length * 6 + 16 : 0;
    return (
      <g
        key={idKey}
        transform={`translate(${x},${y})`}
        onClick={() => handleSelect(node.person_key)}
        onMouseEnter={() => setHoverKey(node.person_key)}
        onMouseLeave={() => setHoverKey(null)}
        style={{ cursor: 'pointer' }}
        role="button"
        aria-label={node.name}
      >
        <rect
          width={CARD_W}
          height={CARD_H}
          rx={12}
          fill={PALETTE.card}
          stroke={hovered ? PALETTE.goldBright : PALETTE.hairline}
          strokeWidth={1}
          filter={hovered ? 'url(#bl-glow-strong)' : 'url(#bl-glow-soft)'}
        />
        {node.photo_record_id ? (
          <>
            <clipPath id={`bl-clip-${idKey}`}>
              <circle cx={28} cy={32} r={20} />
            </clipPath>
            <image
              href={photoUrl(node.photo_record_id)}
              x={8}
              y={12}
              width={40}
              height={40}
              clipPath={`url(#bl-clip-${idKey})`}
              preserveAspectRatio="xMidYMid slice"
            />
          </>
        ) : (
          <>
            <circle cx={28} cy={32} r={20} fill={PALETTE.cardElevated} />
            <text
              x={28}
              y={32.5}
              textAnchor="middle"
              dominantBaseline="central"
              fill={PALETTE.gold}
              fontSize={13}
              fontFamily={SERIF}
              letterSpacing="0.6"
            >
              {monogram(node.name)}
            </text>
          </>
        )}
        <circle
          cx={28}
          cy={32}
          r={21}
          fill="none"
          stroke={hovered ? PALETTE.goldBright : PALETTE.goldDeep}
          strokeWidth={1.25}
        />
        <text x={56} y={30} fill={PALETTE.ivory} fontSize={13} fontFamily={SERIF} letterSpacing="0.2">
          {truncate(node.name)}
        </text>
        <text x={56} y={46} fill={PALETTE.muted} fontSize={10} fontFamily={SANS} letterSpacing="0.4">
          {lifespan(node)}
        </text>
        <circle cx={CARD_W - 11} cy={11} r={3} fill={dot} />
        {pillText && (
          <g transform={`translate(${CARD_W - pillW - 8},${-8})`}>
            <rect width={pillW} height={15} rx={7.5} fill={PALETTE.cardElevated} stroke={PALETTE.goldDeep} strokeWidth={0.75} />
            <text
              x={pillW / 2}
              y={8}
              textAnchor="middle"
              dominantBaseline="central"
              fill={PALETTE.gold}
              fontSize={8}
              fontFamily={SANS}
              letterSpacing="1.2"
            >
              {pillText}
            </text>
          </g>
        )}
      </g>
    );
  };

  const btnStyle: React.CSSProperties = {
    minWidth: 28,
    height: 28,
    padding: '0 8px',
    background: PALETTE.cardElevated,
    color: PALETTE.gold,
    border: `1px solid ${PALETTE.hairline}`,
    borderRadius: 8,
    fontSize: 13,
    fontFamily: SANS,
    lineHeight: '26px',
    cursor: 'pointer',
    userSelect: 'none',
  };

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100%',
        height: 'min(70vh, 560px)',
        overflow: 'hidden',
        borderRadius: 16,
        border: `1px solid ${PALETTE.hairline}`,
        background: PALETTE.bg,
      }}
    >
      {!hasContent ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: PALETTE.muted,
            fontFamily: SERIF,
            fontSize: 14,
            letterSpacing: '0.4px',
          }}
        >
          No bloodline to chart yet.
        </div>
      ) : (
        <>
          <svg
            width="100%"
            height="100%"
            style={{ display: 'block', touchAction: 'none', cursor: dragging ? 'grabbing' : 'grab' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
          >
            <defs>
              <filter id="bl-glow-soft" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceAlpha" stdDeviation={5} result="blur" />
                <feFlood floodColor={PALETTE.gold} floodOpacity={0.18} result="tint" />
                <feComposite in="tint" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="bl-glow-strong" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceAlpha" stdDeviation={7} result="blur" />
                <feFlood floodColor={PALETTE.goldBright} floodOpacity={0.35} result="tint" />
                <feComposite in="tint" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g transform={`translate(${t.x},${t.y}) scale(${t.k})`}>
              {/* Blood connectors */}
              {layout.edges.map((e, i) => (
                <path
                  key={`edge-${i}`}
                  d={e.d}
                  fill="none"
                  stroke={PALETTE.hairline}
                  strokeWidth={1.25}
                />
              ))}
              {/* Step-family connectors (dashed, never in the blood line) */}
              {layout.stepEdges.map((e, i) => (
                <path
                  key={`step-edge-${i}`}
                  d={e.d}
                  fill="none"
                  stroke={PALETTE.goldDeep}
                  strokeOpacity={0.55}
                  strokeWidth={1.25}
                  strokeDasharray="5 5"
                />
              ))}
              {/* Blood cards */}
              {generations.map((row, g) =>
                row.map((node, i) => {
                  const placed = layout.pos.get(node.person_key);
                  return placed ? renderCard(placed, `g${g}-${i}`) : null;
                })
              )}
              {/* Step-family cards */}
              {layout.steps.map((s, i) => renderCard(s, `step-${i}`, s.subtype))}
            </g>
          </svg>

          <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
            <button type="button" style={btnStyle} onClick={() => zoomBy(1.25)} aria-label="Zoom in">
              +
            </button>
            <button type="button" style={btnStyle} onClick={() => zoomBy(0.8)} aria-label="Zoom out">
              {'\u2212'}
            </button>
            <button
              type="button"
              style={{ ...btnStyle, fontSize: 10, letterSpacing: '0.8px' }}
              onClick={reset}
              aria-label="Reset view"
            >
              RESET
            </button>
          </div>
        </>
      )}
    </div>
  );
}