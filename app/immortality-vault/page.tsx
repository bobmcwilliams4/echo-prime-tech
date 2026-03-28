'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

/* ==============================================================================
   ECHO IMMORTALITY VAULT — Preserve Your Legacy Forever
   Product page: hero, features, comparison, pricing, FAQ, footer CTA
   Backend: echo-immortality-vault.bmcii1976.workers.dev (30+ endpoints, 30 D1 tables)
   ============================================================================== */

const FEATURES = [
  { title: 'Voice Cloning & Preservation', desc: 'Capture a loved one\'s voice with as little as 30 seconds of audio. ElevenLabs multilingual_v2 creates a permanent voice clone that sounds exactly like them.', icon: 'M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z' },
  { title: 'Memory Capture Sessions', desc: 'Guided interview sessions covering childhood, career, relationships, life lessons, and wisdom. Audio-first with real-time transcription and emotion detection.', icon: 'M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z' },
  { title: 'Personality Engine', desc: 'Big Five trait extraction from conversations builds a digital personality profile. Speech patterns, humor style, catchphrases, and emotional responses preserved.', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
  { title: 'Life Story Timeline', desc: 'Chronological timeline of every memory, milestone, and story captured. Gap analysis identifies uncovered life periods and suggests questions to fill them.', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
  { title: 'Autonomous Interview Mode', desc: 'AI picks daily questions based on life coverage gaps. No human interviewer needed — the vault interviews itself on schedule, building the archive automatically.', icon: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z' },
  { title: 'Emotional Voice Synthesis', desc: 'Recreated voice speaks with real emotion — happiness, sadness, nostalgia, warmth. Not a flat text-to-speech robot, but a living voice with feeling.', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
  { title: 'FaceTime with the Departed', desc: 'The ultimate vision: video calls with preserved loved ones. Their voice, mannerisms, personality, and wisdom rendered in real-time conversation.', icon: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v8.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z' },
  { title: 'Photo & Video Archive', desc: 'Upload photos and videos with AI-powered tagging, face detection, and automatic timeline placement. Every visual memory organized and searchable.', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 18V6a2.25 2.25 0 012.25-2.25h15A2.25 2.25 0 0121.75 6v12A2.25 2.25 0 0119.5 20.25H4.5A2.25 2.25 0 012.25 18z' },
  { title: 'Biometric Capture', desc: 'MediaPipe facial landmark tracking during video sessions captures micro-expressions, gestures, and mannerisms that make each person unique.', icon: 'M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { title: 'Family Tree Integration', desc: 'Map relationships between vault subjects. Cross-reference shared memories. Build a living family archive that grows across generations.', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' },
  { title: 'Funeral & Memorial Video', desc: 'Auto-generated memorial video from the vault archive — narrated in the subject\'s own voice, set to music, with their favorite photos and stories.', icon: 'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 0A1.125 1.125 0 013.375 4.5h17.25c.621 0 1.125.504 1.125 1.125m-20.625 0v.922c0 .407.262.763.644.888a39.414 39.414 0 019.428 3.583 2.093 2.093 0 002.106 0 39.414 39.414 0 019.428-3.583.901.901 0 00.644-.888V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 2.625V8.625m0 0A1.125 1.125 0 0020.625 7.5H3.375A1.125 1.125 0 002.25 8.625m18.375 0v.922c0 .407-.262.763-.644.888a39.414 39.414 0 00-9.428 3.583 2.093 2.093 0 01-2.106 0 39.414 39.414 0 00-9.428-3.583.901.901 0 01-.644-.888V8.625' },
  { title: 'Privacy & Encryption', desc: 'End-to-end encryption for all audio, video, and personal data. Family-controlled access permissions. Your memories belong to your family, not us.', icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' },
];

const COMPARISON = [
  { feature: 'AI voice cloning', echo: true, eternos: 'Basic', storyworth: false, hereafter: true },
  { feature: 'Autonomous interviews', echo: true, eternos: false, storyworth: false, hereafter: false },
  { feature: 'Personality extraction', echo: true, eternos: false, storyworth: false, hereafter: 'Basic' },
  { feature: 'Emotional voice synthesis', echo: true, eternos: false, storyworth: false, hereafter: false },
  { feature: 'Video FaceTime calls', echo: 'Roadmap', eternos: false, storyworth: false, hereafter: false },
  { feature: 'Biometric capture', echo: true, eternos: false, storyworth: false, hereafter: false },
  { feature: 'Life gap analysis', echo: true, eternos: false, storyworth: false, hereafter: false },
  { feature: 'Family tree mapping', echo: true, eternos: false, storyworth: false, hereafter: false },
  { feature: 'Memorial video generation', echo: true, eternos: false, storyworth: false, hereafter: false },
  { feature: 'Photo/video archive', echo: true, eternos: 'Basic', storyworth: false, hereafter: false },
  { feature: 'End-to-end encryption', echo: true, eternos: true, storyworth: false, hereafter: false },
  { feature: 'Multi-generational archive', echo: true, eternos: false, storyworth: 'Basic', hereafter: false },
  { feature: 'Cloudflare edge hosting', echo: true, eternos: false, storyworth: false, hereafter: false },
  { feature: 'Starting price/month', echo: '$29', eternos: '$49', storyworth: '$99/yr', hereafter: '$29' },
];

const PRICING = [
  { name: 'Keeper', price: 29, desc: 'Preserve one loved one\'s voice and memories', features: ['1 vault subject', 'Voice cloning (30s sample)', '50 interview sessions', '10GB photo/video storage', 'Life timeline', 'Basic personality profile', 'Memorial video', 'Email support'] },
  { name: 'Legacy', price: 79, desc: 'Complete family preservation with autonomous interviews', features: ['5 vault subjects', 'Voice cloning (unlimited samples)', 'Unlimited interview sessions', 'Autonomous Interview Mode', '100GB storage', 'Full personality engine', 'Family tree mapping', 'Emotional voice synthesis', 'Biometric capture', 'Priority support'], popular: true },
  { name: 'Dynasty', price: 199, desc: 'Multi-generational archive for entire families', features: ['Unlimited vault subjects', 'Everything in Legacy', '1TB storage', 'FaceTime calls (when available)', 'Custom memorial videos', 'Cross-generation story linking', 'White-label family portal', 'Dedicated account manager', 'API access'] },
];

const FAQS = [
  { q: 'How much audio do you need to clone a voice?', a: 'As little as 30 seconds of clear audio creates a recognizable clone. For the best results with emotional range and natural speech patterns, we recommend 5-10 minutes of varied conversation. The more samples you provide, the more natural the voice becomes.' },
  { q: 'Can I preserve someone who has already passed away?', a: 'Yes, if you have recordings of their voice — phone messages, home videos, interviews, or any audio/video. We can clone their voice from existing recordings. The more audio available, the better the result. Even a single voicemail can create a meaningful preservation.' },
  { q: 'How does the Autonomous Interview Mode work?', a: 'The AI analyzes what life periods and topics have been covered, identifies gaps, and generates contextually appropriate questions. It can conduct daily interviews via text or voice without any human interviewer needed. The system gets smarter over time, asking deeper follow-up questions based on previous answers.' },
  { q: 'Is my family\'s data safe and private?', a: 'All audio, video, and personal data is encrypted end-to-end. Family members control access permissions. We never use your data for training or share it with third parties. Data is stored on Cloudflare\'s global edge network with enterprise-grade security.' },
  { q: 'What is the FaceTime feature?', a: 'FaceTime with the Departed is our roadmap feature that combines voice cloning, personality engine, and video synthesis to enable real-time video conversations with preserved loved ones. The voice, mannerisms, and personality are rendered live. Currently in development — Dynasty tier members get early access.' },
  { q: 'Can multiple family members contribute memories?', a: 'Absolutely. Family members can add their own stories, photos, and perspectives about a vault subject. This creates a richer, more complete picture from multiple viewpoints. The Family Tree feature links related stories and memories across generations.' },
];

export default function ImmortalityVaultPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { isDark } = useTheme();

  return (
    <>
      <noscript>
        <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
          <h1>Immortality Vault - Echo Prime Technologies</h1>
          <p>Preserve your loved ones forever with AI voice cloning, memory capture sessions, personality engine, and life story timeline. Capture voice, memories, and wisdom so you can talk to them anytime. Visit echo-ept.com for the full interactive experience.</p>
        </div>
      </noscript>
      <FaqSchema faqs={FAQS} />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Immortality Vault', href: '/immortality-vault' }]} />

      {/* ── Nav ── */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime" width={140} height={36} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} /></Link>
        <div className="flex items-center gap-6 text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>
          <Link href="/engines" className="hover:opacity-80">Engines</Link>
          <Link href="/pricing" className="hover:opacity-80">Pricing</Link>
          <Link href="/login" className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>Sign In</Link>
        </div>
      </nav>

      <div style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
        {/* ── Hero ── */}
        <section className="relative py-24 px-4 overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at center, var(--ept-accent), transparent 70%)' }} />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ borderColor: 'var(--ept-accent)', color: 'var(--ept-accent)' }}>DIGITAL LEGACY</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>VOICE CLONING</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 gradient-text">Immortality Vault</h1>
            <p className="text-lg md:text-xl mb-4" style={{ color: 'var(--ept-text-secondary)' }}>Your loved ones never truly leave. Capture their voice, memories, personality, and wisdom — then talk to them anytime.</p>
            <div className="flex items-center justify-center gap-8 mb-8 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
              <span>30 D1 Tables</span><span>|</span><span>4 R2 Buckets</span><span>|</span><span>ElevenLabs Voice AI</span>
            </div>
            <div className="flex gap-4 justify-center">
              <Link href="/pricing" className="px-8 py-3 rounded-xl font-semibold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>Start Preserving</Link>
              <Link href="/docs" className="px-8 py-3 rounded-xl font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>How It Works</Link>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Preserve Every Dimension of a Life</h2>
            <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>12 capabilities that capture what makes someone irreplaceable</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <div key={i} className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
                  <svg className="w-8 h-8 mb-4" style={{ color: 'var(--ept-accent)' }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison ── */}
        <section className="py-20 px-4" style={{ backgroundColor: 'var(--ept-surface)' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Echo Immortality Vault vs Alternatives</h2>
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
              <table className="w-full text-sm">
                <thead><tr style={{ backgroundColor: 'var(--ept-card-bg)' }}>
                  <th className="text-left p-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                  <th className="p-4 font-semibold" style={{ color: 'var(--ept-accent)' }}>Echo</th>
                  <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>Eternos</th>
                  <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>StoryWorth</th>
                  <th className="p-4 font-semibold" style={{ color: 'var(--ept-text-muted)' }}>HereAfter</th>
                </tr></thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-card-border)' }}>
                      <td className="p-4 font-medium">{row.feature}</td>
                      {[row.echo, row.eternos, row.storyworth, row.hereafter].map((v, j) => (
                        <td key={j} className="p-4 text-center">{v === true ? <span style={{ color: 'var(--ept-accent)' }}>&#10003;</span> : v === false ? <span style={{ color: 'var(--ept-text-muted)' }}>&#10007;</span> : <span style={{ color: 'var(--ept-text-secondary)' }}>{v}</span>}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Preserve What Matters Most</h2>
            <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>Every plan includes voice cloning, memory capture, and a living timeline</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PRICING.map((p, i) => (
                <div key={i} className={`p-8 rounded-2xl border ${p.popular ? 'ring-2' : ''}`} style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: p.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', ...(p.popular ? { ringColor: 'var(--ept-accent)' } : {}) }}>
                  {p.popular && <div className="text-xs font-bold uppercase mb-4 text-center" style={{ color: 'var(--ept-accent)' }}>Most Popular</div>}
                  <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--ept-text-secondary)' }}>{p.desc}</p>
                  <div className="text-4xl font-extrabold mb-6">${p.price}<span className="text-base font-normal" style={{ color: 'var(--ept-text-muted)' }}>/mo</span></div>
                  <ul className="space-y-3 mb-8">
                    {p.features.map((f, j) => <li key={j} className="flex items-start gap-2 text-sm"><span style={{ color: 'var(--ept-accent)' }}>&#10003;</span><span>{f}</span></li>)}
                  </ul>
                  <Link href="/pricing" className="block text-center px-6 py-3 rounded-xl font-semibold text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>Get Started</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 px-4" style={{ backgroundColor: 'var(--ept-surface)' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left font-semibold">
                    <span>{faq.q}</span>
                    <span className="ml-4 text-xl" style={{ color: 'var(--ept-accent)' }}>{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">They Shaped Who You Are. Don&apos;t Let Their Voice Fade.</h2>
            <p className="mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Start preserving your family&apos;s legacy today. Every day without recording is a memory that could be lost forever.</p>
            <Link href="/pricing" className="inline-block px-10 py-4 rounded-xl font-semibold text-lg text-white" style={{ backgroundColor: 'var(--ept-accent)' }}>Start Free Trial</Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t py-8 px-4 text-center text-sm" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
          &copy; {new Date().getFullYear()} Echo Prime Technologies. All rights reserved.
        </footer>
      </div>
    </>
  );
}
