'use client';

/* ==============================================================================
   IMMORTALITY VAULT — landing page.
   Standalone product. Gold-on-black identity of the intro film. COMPLETELY
   separate from echo-ept.com: no page here ever links to an EPT route, uses no
   EPT design tokens, and every CTA stays inside the Vault. See SPEC.md and the
   build-time guard scripts/verify-vault-separation.js (do not defeat it).

   Built by Bobby Don McWilliams II for his father, diagnosed with Alzheimer's —
   to preserve him before the disease takes his memories. Keep it reverent.
   ============================================================================== */

import { useState } from 'react';
import Link from 'next/link';
import { Cormorant_Garamond } from 'next/font/google';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

/* Vault-owned routes only. */
const R = {
  app: '/immortality-vault/app',
  login: '/immortality-vault/login',
  home: '/immortality-vault',
};
const VAULT_API = 'https://vault-api.echo-op.com';

/* ── palette (gold on warm black — the intro) ── */
const C = {
  bg: '#0a0807',
  bg2: '#100d0b',
  card: '#14100c',
  gold: '#d4b483',
  goldBright: '#ecd29a',
  goldDeep: '#b8934f',
  ivory: '#ece3d2',
  muted: '#9c9081',
  hair: 'rgba(212,180,131,0.16)',
};

const FEATURES = [
  { t: 'His Voice, Kept Forever', d: 'From even a short recording, we preserve and re-create a loved one’s real voice — so their words are always heard in the voice you know, not a machine.' },
  { t: 'Guided Memory Sessions', d: 'Echo gently walks through a whole life — childhood, family, love, work, hardship, faith, the lessons only they can tell. Every answer becomes part of who they are.' },
  { t: 'Their Way of Being', d: 'From their stories we learn how they think, their humor, their phrases, the way they’d answer — building a personality that feels unmistakably them.' },
  { t: 'Answer on Camera', d: 'Record on video and we also keep their face, expressions, and the small mannerisms that make them who they are.' },
  { t: 'A Life’s Timeline', d: 'Every memory and milestone, in order. Echo notices the years still untold and gently asks the questions that fill them in.' },
  { t: 'Echo Interviews for You', d: 'A couple of gentle questions arrive each day. No interviewer needed — the vault fills itself, one memory at a time, without pressure.' },
  { t: 'Talk With Them Again', d: 'Family can speak with the preserved person — in words and in their own voice — and, in time, face to face. The ultimate promise of the Vault.' },
  { t: 'A Memorial in Their Voice', d: 'When the time comes, the Vault can create a memorial — narrated in their own voice, set to their photos and their stories.' },
  { t: 'Yours Alone, Protected', d: 'Every recording and memory is encrypted and family-controlled. These belong to your family — never sold, never used to train anything, never shared.' },
];

const PRICING = [
  { slug: 'keeper', name: 'Keeper', price: 29, desc: 'Preserve one person you love.', features: ['One vault', 'Voice preserved & re-created', 'Guided memory sessions', 'Life timeline', 'Photo & video archive', 'A memorial in their voice'] },
  { slug: 'legacy', name: 'Legacy', price: 79, popular: true, desc: 'For the whole family, capturing every day.', features: ['Up to 5 vaults', 'Everything in Keeper', 'Echo interviews daily — automatically', 'Full personality & mannerisms', 'On-camera biometric capture', 'Talk-with-them playback', 'Priority care'] },
  { slug: 'dynasty', name: 'Dynasty', price: 199, desc: 'A living archive across generations.', features: ['Unlimited vaults', 'Everything in Legacy', 'Face-to-face calls (as released)', 'Custom memorial films', 'Cross-generation story linking', 'A private family portal', 'A dedicated guide'] },
];

const FAQS = [
  { q: 'Can you preserve someone who is already gone — or losing their memory?', a: 'Yes. If you have any recordings — voicemails, home videos, interviews — we can re-create their voice from them. And if a loved one is living with Alzheimer’s or illness, this is exactly why the Vault exists: to hold onto them now, gently, while there is still time. Even a few minutes a day preserves what matters.' },
  { q: 'How much audio do you need to keep a voice?', a: 'As little as 30 seconds creates a recognizable voice. A few minutes of natural conversation makes it warmer and more true. The more they speak, the more themselves it becomes.' },
  { q: 'Does Echo really talk with them — out loud?', a: 'Yes. Echo speaks each question aloud, listens to the answer, and can talk with you — answer your questions, follow what moves you, and take its time. It’s a conversation, not a form.' },
  { q: 'Is my family’s data private?', a: 'Completely. Everything is encrypted and controlled by your family. We never sell it, never share it, and never use it to train anything. These memories are yours.' },
  { q: 'Who made the Immortality Vault?', a: 'It was built by Bobby Don McWilliams II, founder of Echo Prime, for his own father after an Alzheimer’s diagnosis — to keep him before the disease could take his memories. It was made by a son, for his dad, so that no one has to lose the sound of the person who shaped them.' },
];

function Check() {
  return <span style={{ color: C.gold, marginTop: 2 }} aria-hidden>&#10003;</span>;
}

/* ── The Vault mark: an ember held within a diamond (echoes the intro film) ── */
function VaultMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2.4 21.6 12 12 21.6 2.4 12 12 2.4Z" stroke={C.gold} strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="6.2" stroke={C.goldDeep} strokeWidth="0.7" opacity="0.5" />
      <circle cx="12" cy="12" r="3.2" fill={C.gold} opacity="0.92" />
    </svg>
  );
}

/* ── Feature marks: a distinct gold line-icon for each promise (not nine ◆) ── */
function FeatureIcon({ i, size = 30 }: { i: number; size?: number }) {
  const p = { fill: C.gold, stroke: 'none' } as const;
  const inner = [
    // 0 · voice, kept forever — microphone
    <g key="0"><path d="M12 3a2.6 2.6 0 0 0-2.6 2.6v5.8a2.6 2.6 0 0 0 5.2 0V5.6A2.6 2.6 0 0 0 12 3Z" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0" /><path d="M12 17.5V21" /></g>,
    // 1 · guided memory sessions — conversation
    <g key="1"><path d="M4 5h16v10H9l-4.5 3.5V5Z" /><circle cx="9" cy="10" r="0.95" {...p} /><circle cx="12" cy="10" r="0.95" {...p} /><circle cx="15" cy="10" r="0.95" {...p} /></g>,
    // 2 · their way of being — a spark
    <path key="2" d="M12 2.5l2 6.2 6.2 2-6.2 2-2 6.2-2-6.2-6.2-2 6.2-2 2-6.2Z" />,
    // 3 · answer on camera
    <g key="3"><rect x="3" y="6.5" width="13" height="11" rx="2" /><path d="M16 10.4l5-2.8v8.8l-5-2.8" /></g>,
    // 4 · a life's timeline
    <g key="4"><path d="M3 12h18" /><circle cx="7" cy="12" r="1.7" {...p} /><circle cx="12" cy="12" r="1.7" {...p} /><circle cx="17" cy="12" r="1.7" {...p} /></g>,
    // 5 · Echo interviews for you — daily
    <g key="5"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 9.5h16M9 3v4M15 3v4" /></g>,
    // 6 · talk with them again — two voices
    <g key="6"><path d="M3 5h11v7H7l-4 3V5Z" /><path d="M9.5 13.6V15a1.8 1.8 0 0 0 1.8 1.8H17l4 2.6v-8A1.8 1.8 0 0 0 19.2 11.6H17" /></g>,
    // 7 · a memorial in their voice — flame
    <path key="7" d="M12 3c2.8 3 4.3 5.4 4.3 7.9a4.3 4.3 0 0 1-8.6 0c0-1.3.5-2.5 1.4-3.6.7 1 1.6 1.3 2.3 1 .9-.4 1-1.7.6-3.3Z" />,
    // 8 · yours alone, protected — shield
    <g key="8"><path d="M12 3l7 3v5c0 4.4-3 7.4-7 8.9C8 17.4 5 14.4 5 11V6l7-3Z" /><path d="M9 11.5l2 2 4-4" /></g>,
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {inner[i] ?? inner[0]}
    </svg>
  );
}

export default function ImmortalityVaultPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [busyPlan, setBusyPlan] = useState<string | null>(null);

  /* Vault checkout via ECHO's payment cap (vault backend → Stripe). Falls back
     to beginning the vault if checkout isn't provisioned yet. Never touches EPT. */
  async function choosePlan(slug: string) {
    setBusyPlan(slug);
    try {
      const res = await fetch(`${VAULT_API}/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: slug, success_url: `${R.app}?welcome=1`, cancel_url: `${R.home}#pricing` }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.url) { window.location.href = data.url; return; }
      }
    } catch { /* fall through */ }
    // Not provisioned yet → begin the vault (free) with the plan remembered.
    window.location.href = `${R.app}?plan=${slug}`;
  }

  return (
    <div style={{ background: C.bg, color: C.ivory, minHeight: '100vh' }}>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Immortality Vault', href: R.home }]} />

      {/* ── Nav (Vault-only) ── */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: `1px solid ${C.hair}`, position: 'sticky', top: 0, zIndex: 40, background: 'rgba(10,8,7,0.82)', backdropFilter: 'blur(10px)' }}>
        <Link href={R.home} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <VaultMark size={24} />
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, letterSpacing: '0.06em', color: C.ivory }}>Immortality Vault</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, fontSize: 14 }}>
          <a href="#how" style={{ color: C.muted, textDecoration: 'none' }} className="iv-navlink">How it works</a>
          <a href="#pricing" style={{ color: C.muted, textDecoration: 'none' }} className="iv-navlink">Plans</a>
          <Link href={R.login} style={{ color: C.bg, background: C.gold, padding: '9px 18px', borderRadius: 999, fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', textAlign: 'center', padding: '150px 20px 116px', overflow: 'hidden' }}>
        {/* cinematic ember backdrop — Grok Imagine, matching the intro film */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/immortality-vault/hero-ember.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 32%', opacity: 0.6, pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(10,8,7,0.72) 0%, rgba(10,8,7,0.42) 40%, ${C.bg} 100%)`, pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', top: '-6%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 620, background: `radial-gradient(ellipse at center, ${C.goldDeep}22, transparent 72%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 820, margin: '0 auto' }}>
          <div style={{ fontSize: 12, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.gold, marginBottom: 26 }}>Preserve a life, forever</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 'clamp(44px, 8vw, 88px)', lineHeight: 1.02, letterSpacing: '0.01em', margin: '0 0 26px', color: C.ivory, textWrap: 'balance' as const }}>
            Never lose the sound<br />of the ones who<br /><span style={{ color: C.gold, fontStyle: 'italic' }}>shaped you.</span>
          </h1>
          <p style={{ fontSize: 'clamp(17px, 2.4vw, 21px)', lineHeight: 1.6, color: C.muted, maxWidth: 620, margin: '0 auto 40px' }}>
            Capture their voice, their memories, their way of being &mdash; guided gently, in conversation. So your family can talk with them for generations.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={R.app} style={{ background: C.gold, color: C.bg, padding: '15px 34px', borderRadius: 999, fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: `0 0 40px ${C.goldDeep}44` }} className="iv-cta">Begin their vault</Link>
            <a href="#how" style={{ border: `1px solid ${C.hair}`, color: C.ivory, padding: '15px 30px', borderRadius: 999, fontSize: 16, fontWeight: 600, textDecoration: 'none' }} className="iv-ghost">How it works</a>
          </div>
          <div style={{ marginTop: 30, fontSize: 13.5, color: C.muted, display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span>Voice</span><span style={{ color: C.hair }}>&middot;</span><span>Memory</span><span style={{ color: C.hair }}>&middot;</span><span>Personality</span><span style={{ color: C.hair }}>&middot;</span><span>Presence</span>
          </div>
        </div>
      </section>

      {/* ── Why it exists (the heart) ── */}
      <section style={{ padding: '20px 20px 80px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', borderTop: `1px solid ${C.hair}`, borderBottom: `1px solid ${C.hair}`, padding: '48px 24px' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(22px, 3.6vw, 30px)', lineHeight: 1.5, color: C.ivory, margin: 0 }}>
            &ldquo;Built by a son for his father, after an Alzheimer&rsquo;s diagnosis &mdash; to keep him before the disease could take his memories.&rdquo;
          </p>
          <div style={{ marginTop: 18, fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold }}>Why the Vault exists</div>
        </div>
      </section>

      {/* ── Features / how it works ── */}
      <section id="how" style={{ padding: '70px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 'clamp(30px,5vw,46px)', textAlign: 'center', margin: '0 0 12px', color: C.ivory }}>Preserve every part of a person</h2>
          <p style={{ textAlign: 'center', color: C.muted, margin: '0 auto 52px', maxWidth: 560, fontSize: 17 }}>Not a questionnaire &mdash; a conversation that keeps what makes someone irreplaceable.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="iv-card" style={{ background: C.card, border: `1px solid ${C.hair}`, borderRadius: 16, padding: '28px 26px' }}>
                <div aria-hidden style={{ marginBottom: 16, width: 54, height: 54, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(150deg, ${C.goldDeep}26, transparent 70%)`, border: `1px solid ${C.hair}` }}><FeatureIcon i={i} /></div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, margin: '0 0 10px', color: C.ivory }}>{f.t}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: C.muted, margin: 0 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing (Vault checkout, never EPT) ── */}
      <section id="pricing" style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 'clamp(30px,5vw,46px)', textAlign: 'center', margin: '0 0 12px', color: C.ivory }}>Begin while there is time</h2>
          <p style={{ textAlign: 'center', color: C.muted, margin: '0 auto 52px', maxWidth: 560, fontSize: 17 }}>Every plan preserves voice, memories, and a living timeline. Start free &mdash; keep them today.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'start' }}>
            {PRICING.map((p) => (
              <div key={p.slug} style={{ background: C.card, border: `1px solid ${p.popular ? C.gold : C.hair}`, borderRadius: 20, padding: '34px 30px', position: 'relative', boxShadow: p.popular ? `0 0 50px ${C.goldDeep}22` : 'none' }}>
                {p.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: C.gold, color: C.bg, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 999 }}>Most chosen</div>}
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600, margin: '0 0 6px', color: C.ivory }}>{p.name}</h3>
                <p style={{ fontSize: 14.5, color: C.muted, margin: '0 0 20px', minHeight: 42 }}>{p.desc}</p>
                <div style={{ marginBottom: 24 }}><span style={{ fontFamily: 'var(--font-serif)', fontSize: 46, fontWeight: 600, color: C.ivory }}>${p.price}</span><span style={{ color: C.muted, fontSize: 15 }}>/mo</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {p.features.map((f, j) => <li key={j} style={{ display: 'flex', gap: 10, fontSize: 14.5, color: C.ivory, lineHeight: 1.4 }}><Check />{f}</li>)}
                </ul>
                <button onClick={() => choosePlan(p.slug)} disabled={busyPlan === p.slug}
                  style={{ width: '100%', padding: '13px', borderRadius: 999, fontSize: 15, fontWeight: 700, cursor: 'pointer', border: p.popular ? 'none' : `1px solid ${C.gold}`, background: p.popular ? C.gold : 'transparent', color: p.popular ? C.bg : C.gold, opacity: busyPlan === p.slug ? 0.6 : 1 }} className="iv-plan">
                  {busyPlan === p.slug ? 'One moment…' : `Choose ${p.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '70px 20px', background: C.bg2 }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 'clamp(30px,5vw,46px)', textAlign: 'center', margin: '0 0 44px', color: C.ivory }}>Questions, answered gently</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ border: `1px solid ${C.hair}`, borderRadius: 14, background: C.card, overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 22px', background: 'transparent', border: 'none', color: C.ivory, fontSize: 16.5, fontWeight: 500, textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-serif)' }}>
                  <span>{faq.q}</span>
                  <span style={{ color: C.gold, fontSize: 22, flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <div style={{ padding: '0 22px 22px', fontSize: 15, lineHeight: 1.7, color: C.muted }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section style={{ padding: '116px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/immortality-vault/hero-ember.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 58%', opacity: 0.34, pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, rgba(10,8,7,0.35), ${C.bg} 74%)` }} />
        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 'clamp(30px,5.5vw,52px)', lineHeight: 1.1, margin: '0 0 20px', color: C.ivory, textWrap: 'balance' as const }}>Every day is a memory that could be lost.</h2>
          <p style={{ color: C.muted, fontSize: 18, margin: '0 0 36px' }}>Begin their vault today. It only takes a few gentle minutes.</p>
          <Link href={R.app} style={{ background: C.gold, color: C.bg, padding: '17px 44px', borderRadius: 999, fontSize: 17, fontWeight: 700, textDecoration: 'none', boxShadow: `0 0 44px ${C.goldDeep}55` }} className="iv-cta">Begin their vault</Link>
        </div>
      </section>

      {/* ── Footer (quiet credit, no EPT link) ── */}
      <footer style={{ borderTop: `1px solid ${C.hair}`, padding: '34px 20px', textAlign: 'center', color: C.muted, fontSize: 13.5 }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: C.ivory, marginBottom: 8 }}>Immortality Vault</div>
        <div>Made for the ones who shaped us. &copy; {new Date().getFullYear()} &middot; An Echo Prime creation.</div>
      </footer>

      <style>{`
        :root { --font-serif: ${serif.style.fontFamily}; }
        html { scroll-behavior: smooth; }
        .iv-navlink:hover { color: ${C.ivory} !important; }
        .iv-cta { transition: transform .18s ease, box-shadow .18s ease; }
        .iv-cta:hover { transform: translateY(-2px); box-shadow: 0 0 56px ${C.goldDeep}77 !important; }
        .iv-ghost:hover { border-color: ${C.gold} !important; }
        .iv-card { transition: border-color .2s ease, transform .2s ease; }
        .iv-card:hover { border-color: ${C.hair}; transform: translateY(-3px); }
        .iv-plan:hover:not(:disabled) { filter: brightness(1.06); }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } .iv-cta, .iv-card { transition: none; } }
      `}</style>
    </div>
  );
}
