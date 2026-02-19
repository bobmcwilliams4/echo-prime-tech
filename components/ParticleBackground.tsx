'use client';

import { useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════
   PARTICLE BACKGROUND — EPT site-wide ambient backdrop
   Gold/teal starfield, shooting stars, nebula wisps, floating
   particles. Adapts to day/night theme.
   ═══════════════════════════════════════════════════════════════ */

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateStars(count: number, seed: number) {
  const rng = seededRandom(seed);
  return Array.from({ length: count }, () => ({
    x: rng() * 100,
    y: rng() * 100,
    size: rng() * 2.2 + 0.6,
    opacity: rng() * 0.4 + 0.3,
    twinkleDelay: rng() * 10,
    twinkleDuration: 2.5 + rng() * 5,
    colorTemp: rng(),
  }));
}

const STAR_LAYERS = [
  { count: 120, seed: 42, speed: 0.3, sizeMultiplier: 0.7 },
  { count: 80, seed: 137, speed: 0.5, sizeMultiplier: 1.0 },
  { count: 40, seed: 256, speed: 0.8, sizeMultiplier: 1.4 },
];

const NEBULA_WISPS = [
  { top: '5%', left: '10%', size: 300, blur: 70, delay: 0 },
  { top: '25%', left: '70%', size: 220, blur: 50, delay: 5 },
  { top: '45%', left: '30%', size: 280, blur: 60, delay: 10 },
  { top: '60%', left: '80%', size: 200, blur: 45, delay: 3 },
  { top: '75%', left: '15%', size: 260, blur: 55, delay: 8 },
  { top: '90%', left: '55%', size: 240, blur: 65, delay: 15 },
];

function getStarColor(temp: number, opacity: number, isDark: boolean): string {
  if (!isDark) {
    // Day: very subtle gold/teal dots
    if (temp < 0.5) return `rgba(13,115,119,${opacity * 0.3})`;
    return `rgba(180,160,100,${opacity * 0.25})`;
  }
  // Night: teal → warm gold → white
  if (temp < 0.25) return `rgba(20,184,166,${opacity})`;
  if (temp < 0.5) return `rgba(100,200,190,${opacity})`;
  if (temp < 0.75) return `rgba(200,200,180,${opacity})`;
  return `rgba(201,169,78,${opacity})`;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let shootingStars: {
      x: number; y: number; vx: number; vy: number;
      length: number; life: number; maxLife: number; brightness: number;
    }[] = [];
    let lastShootingStar = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = (time: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const isDark = document.documentElement.classList.contains('dark');
      if (!isDark) {
        // Day mode: very minimal canvas effects
        animId = requestAnimationFrame(animate);
        return;
      }

      // Shooting stars (night only)
      if (time - lastShootingStar > 4000 + Math.random() * 6000) {
        lastShootingStar = time;
        const angle = Math.PI * 0.15 + Math.random() * Math.PI * 0.3;
        const speed = 4 + Math.random() * 5;
        shootingStars.push({
          x: Math.random() * w * 0.8,
          y: Math.random() * h * 0.4,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          length: 50 + Math.random() * 70,
          life: 0,
          maxLife: 30 + Math.random() * 40,
          brightness: 0.5 + Math.random() * 0.4,
        });
      }

      shootingStars = shootingStars.filter(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        const progress = s.life / s.maxLife;
        const alpha = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;
        const finalAlpha = alpha * s.brightness * 0.7;

        // Gold/teal trail
        const grad = ctx.createLinearGradient(
          s.x, s.y,
          s.x - s.vx * s.length / 8, s.y - s.vy * s.length / 8
        );
        grad.addColorStop(0, `rgba(201,169,78,${finalAlpha})`);
        grad.addColorStop(0.4, `rgba(20,184,166,${finalAlpha * 0.4})`);
        grad.addColorStop(1, 'rgba(20,184,166,0)');
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * s.length / 8, s.y - s.vy * s.length / 8);
        ctx.stroke();

        // Bright head
        const headGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 3.5);
        headGrad.addColorStop(0, `rgba(255,255,255,${finalAlpha})`);
        headGrad.addColorStop(0.5, `rgba(201,169,78,${finalAlpha * 0.5})`);
        headGrad.addColorStop(1, 'rgba(201,169,78,0)');
        ctx.beginPath();
        ctx.fillStyle = headGrad;
        ctx.arc(s.x, s.y, 3.5, 0, Math.PI * 2);
        ctx.fill();

        return s.life < s.maxLife;
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const isDarkSSR = false; // Will be overridden client-side via CSS

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Star layers — visible in dark mode, very subtle in light */}
      {STAR_LAYERS.map((layer, li) => {
        const stars = generateStars(layer.count, layer.seed);
        return (
          <div
            key={li}
            className="absolute inset-0 ept-stars"
            style={{
              animation: `ept-star-drift-${li} ${300 / layer.speed}s linear infinite`,
            }}
          >
            {stars.map((star, si) => (
              <div
                key={si}
                className="absolute rounded-full ept-star"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size * layer.sizeMultiplier,
                  height: star.size * layer.sizeMultiplier,
                  '--star-opacity': star.opacity,
                  '--star-glow': `${star.size * 2.5}px`,
                  '--star-color-temp': star.colorTemp,
                  animation: `ept-twinkle ${star.twinkleDuration}s ease-in-out ${star.twinkleDelay}s infinite`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        );
      })}

      {/* Nebula wisps — colored glow patches */}
      {NEBULA_WISPS.map((wisp, wi) => (
        <div
          key={`wisp-${wi}`}
          className="absolute rounded-full ept-wisp"
          style={{
            top: wisp.top,
            left: wisp.left,
            width: wisp.size,
            height: wisp.size,
            filter: `blur(${wisp.blur}px)`,
            animation: `ept-wisp-pulse ${18 + wi * 3}s ease-in-out ${wisp.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Shooting stars canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 2 }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SMOKE DIVIDER — Atmospheric section separator
   ═══════════════════════════════════════════════════════════════ */
export function SmokeDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className="relative w-full overflow-hidden pointer-events-none"
      style={{ height: '120px', transform: flip ? 'scaleY(-1)' : 'none' }}
    >
      <div className="absolute inset-0 ept-smoke-layer" style={{ animation: 'ept-smoke-drift 25s linear infinite' }}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-0 w-[200%] h-full">
          <path
            d="M0,80 C120,20 240,100 360,60 C480,20 600,90 720,50 C840,10 960,80 1080,40 C1200,0 1320,70 1440,30 L1440,120 L0,120 Z"
            className="ept-smoke-path"
          />
          <path
            d="M0,90 C180,40 300,100 480,70 C660,40 780,95 960,65 C1140,35 1260,85 1440,55 L1440,120 L0,120 Z"
            className="ept-smoke-path-2"
            style={{ opacity: 0.5 }}
          />
        </svg>
      </div>
      <div className="absolute inset-0 ept-smoke-layer" style={{ animation: 'ept-smoke-drift 35s linear infinite reverse', opacity: 0.6 }}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-0 w-[200%] h-full">
          <path
            d="M0,60 C200,100 350,20 500,70 C650,120 800,30 950,80 C1100,130 1250,40 1440,70 L1440,120 L0,120 Z"
            className="ept-smoke-path"
          />
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MATRIX RAIN — Falling code columns
   ═══════════════════════════════════════════════════════════════ */
export function MatrixRain({ columns = 30, opacity = 0.08 }: { columns?: number; opacity?: number }) {
  const chars = 'ECHOPRIMEΩΔΣΦΨΛΠ01アイウエオカキクケコ';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0, opacity }}>
      {Array.from({ length: columns }, (_, i) => {
        const left = (i / columns) * 100 + Math.random() * (100 / columns);
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 10;
        const text = Array.from({ length: 20 + Math.floor(Math.random() * 15) }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join('');
        return (
          <div
            key={i}
            className="absolute font-mono text-xs ept-matrix-col"
            style={{
              left: `${left}%`,
              top: '-100%',
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
              animation: `ept-matrix-fall ${duration}s linear ${delay}s infinite`,
              letterSpacing: '0.15em',
            }}
          >
            {text.split('').map((ch, ci) => (
              <span key={ci} style={{ opacity: 0.2 + Math.random() * 0.6 }}>{ch}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
