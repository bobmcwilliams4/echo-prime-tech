'use client';

/**
 * FairySprite — the golden sprite from the Immortality Vault intro film, drifting
 * across the app now and then. Every ~20–40s it flies edge-to-edge on a gentle
 * sine path with a soft glow, fading in and out; the trail on the sprite always
 * follows behind (it's flipped when flying right→left). Purely decorative:
 * pointer-events are off, and it renders nothing when the viewer prefers reduced
 * motion. The sprite art is public/immortality-vault/fairy.png (keyed from the
 * intro's frame — bright gold on transparent).
 */

import { useEffect, useRef } from 'react';

const SRC = '/immortality-vault/fairy.png';
const SPRITE_W = 110; // displayed width (art is 220×150 → head + trail)

export default function FairySprite() {
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (reduce?.matches) return; // honor reduced-motion: no flights at all

    let timer: number | undefined;
    let anim: Animation | undefined;
    let cancelled = false;

    const flyOnce = () => {
      if (cancelled || !ref.current) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Fly across the upper-middle band, never hugging the very top/bottom.
      const rightward = Math.random() < 0.5;
      const baseY = vh * (0.16 + Math.random() * 0.42);
      const startX = rightward ? -SPRITE_W : vw + SPRITE_W;
      const endX = rightward ? vw + SPRITE_W : -SPRITE_W;
      const drift = vh * (0.05 + Math.random() * 0.08); // vertical sway amplitude
      const phase = Math.random() * Math.PI * 2;
      const cycles = 1 + Math.random(); // 1–2 gentle waves across the screen
      const flip = rightward ? 1 : -1;  // keep the trail behind the head

      const steps = 40;
      const frames: Keyframe[] = [];
      for (let i = 0; i <= steps; i++) {
        const p = i / steps;
        const x = startX + (endX - startX) * p;
        const y = baseY + Math.sin(p * Math.PI * cycles + phase) * drift;
        // fade in over the first ~14%, out over the last ~18%
        const opacity =
          p < 0.14 ? p / 0.14 : p > 0.82 ? Math.max(0, (1 - p) / 0.18) : 1;
        frames.push({
          transform: `translate(${x}px, ${y}px) scaleX(${flip})`,
          opacity: (opacity * 0.9).toFixed(3),
          offset: p,
        });
      }

      const duration = 8000 + Math.random() * 3500; // 8–11.5s glide
      anim = ref.current.animate(frames, { duration, easing: 'linear', fill: 'forwards' });
      anim.onfinish = () => {
        if (cancelled) return;
        timer = window.setTimeout(flyOnce, 20000 + Math.random() * 20000); // next in 20–40s
      };
    };

    // First appearance a little after load, so it doesn't compete with page paint.
    timer = window.setTimeout(flyOnce, 6000 + Math.random() * 9000);

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
      anim?.cancel();
    };
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={SRC}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: SPRITE_W,
        height: 'auto',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 35,
        willChange: 'transform, opacity',
        filter: 'drop-shadow(0 0 10px rgba(245,196,81,0.55))',
        userSelect: 'none',
      }}
    />
  );
}
