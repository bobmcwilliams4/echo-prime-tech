'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';

/* ==============================================================================
   GGI APEX PREDATOR — AI Gaming Companion
   Product page: hero, features, modes, supported games, pricing, FAQ, beta CTA
   Backend: local Python daemon + Steam Overlay control panel (localhost:27060)
   ============================================================================== */

const FEATURES = [
  { title: 'Auto-Detect Any Game', desc: '45+ games auto-detected on launch. Process polling + Steam API fallback. Zero manual config needed.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { title: 'Real-Time Screen Analysis', desc: 'Computer vision reads health bars, minimaps, economy, cooldowns, and game state every frame.', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
  { title: '8 Play Modes', desc: 'Observe, Assist, Coach, Copilot, Autonomous, Training, Mimic, and Swarm. Scale from passive tips to full AI control.', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
  { title: 'Human-Like Input', desc: 'Gaussian timing jitter, Bezier mouse curves, variable key-hold durations. Undetectable by anti-cheat.', icon: 'M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11' },
  { title: 'Steam Overlay Panel', desc: 'Full control panel accessible inside any game via Steam Overlay (Shift+Tab). Change modes, settings, and games live.', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { title: 'Per-Game Settings', desc: 'Skill level, aggression, DPI, reaction time, session limits — each game remembers your exact preferences.', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  { title: 'Safety Layer', desc: 'Actions-per-second limits, kill switch (F12), audit trail, and session hour caps. Full control, always.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'Pro Player Mimicry', desc: 'Load pro player profiles. The AI replicates their crosshair placement, positioning, rotation patterns, and economy decisions.', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { title: 'Spray Pattern Training', desc: 'Interactive recoil control drills with accuracy scoring. Master every weapon pattern with guided practice.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { title: 'Learning System', desc: 'Records every session. Analyzes your mistakes. Improves the AI model after each game. Gets smarter the more you play.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

const PLAY_MODES = [
  { mode: 'Observe', desc: 'AI watches silently. Learns your patterns, maps your habits, builds your profile. Zero interference.', color: '#6b7280', risk: 'None' },
  { mode: 'Assist', desc: 'Contextual tips, build recommendations, and callouts. Like having a coach whispering in your ear.', color: '#3b82f6', risk: 'None' },
  { mode: 'Coach', desc: 'Active voice coaching during gameplay. Corrects positioning, rotation, and decision-making in real-time.', color: '#8b5cf6', risk: 'None' },
  { mode: 'Copilot', desc: 'AI handles secondary tasks — ability combos, resource management, map awareness — while you focus on combat.', color: '#f59e0b', risk: 'Low' },
  { mode: 'Autonomous', desc: 'Full AI control. Plays the game at superhuman speed with perfect mechanics. You sit back and watch.', color: '#ef4444', risk: 'High' },
  { mode: 'Training', desc: 'Guided drills for aim, spray control, build patterns, and APM. Structured practice with scoring.', color: '#10b981', risk: 'None' },
  { mode: 'Mimic', desc: 'Loads a pro player profile and replicates their exact play style, decision patterns, and positioning.', color: '#ec4899', risk: 'Medium' },
  { mode: 'Swarm', desc: 'Multi-agent coordination across team members. Synchronized pushes, coordinated utility usage, hive-mind tactics.', color: '#f97316', risk: 'High' },
];

const GAME_CATEGORIES = [
  { genre: 'FPS / Tactical Shooters', games: ['Counter-Strike 2', 'Valorant', 'Call of Duty', 'Apex Legends', 'Overwatch 2', 'Rainbow Six Siege', 'Fortnite', 'PUBG', 'Escape from Tarkov', 'Hunt: Showdown', 'Halo Infinite', 'Team Fortress 2', 'Destiny 2'] },
  { genre: 'MOBA / Strategy', games: ['League of Legends', 'Dota 2', 'StarCraft II', 'Age of Empires IV', 'Civilization VI', 'Total War', 'SMITE 2'] },
  { genre: 'Battle Royale', games: ['Fortnite', 'Apex Legends', 'PUBG', 'Warzone', 'Fall Guys'] },
  { genre: 'RPG / MMO', games: ['World of Warcraft', 'Final Fantasy XIV', 'Path of Exile', 'Diablo IV', 'Lost Ark', 'Elden Ring', 'Dark Souls III'] },
  { genre: 'Sports / Racing', games: ['FIFA / EA FC', 'Rocket League', 'NBA 2K', 'Forza Horizon 5', 'iRacing', 'Gran Turismo'] },
  { genre: 'Card / Board', games: ['Chess', 'Hearthstone', 'Magic: The Gathering Arena', 'Poker', 'Go'] },
];

const COMPARISON = [
  { feature: 'Auto-detects game launches', ggi: true, aim_lab: false, overwolf: 'Partial', manual: false },
  { feature: 'Real-time screen analysis', ggi: true, aim_lab: false, overwolf: false, manual: false },
  { feature: 'AI plays autonomously', ggi: true, aim_lab: false, overwolf: false, manual: false },
  { feature: 'Pro player mimicry', ggi: true, aim_lab: false, overwolf: false, manual: false },
  { feature: 'Steam Overlay integration', ggi: true, aim_lab: false, overwolf: true, manual: false },
  { feature: 'Per-game AI settings', ggi: true, aim_lab: false, overwolf: 'Partial', manual: false },
  { feature: 'Safety / kill switch', ggi: true, aim_lab: 'N/A', overwolf: 'N/A', manual: 'N/A' },
  { feature: 'Spray pattern training', ggi: true, aim_lab: true, overwolf: false, manual: false },
  { feature: 'Multi-game support (45+)', ggi: true, aim_lab: false, overwolf: true, manual: false },
  { feature: 'Learning from your gameplay', ggi: true, aim_lab: 'Basic', overwolf: false, manual: false },
];

const PRICING = [
  { tier: 'Free Beta', price: 0, period: 'forever during beta', features: ['All 45+ games', 'Observe + Assist modes', 'Steam Overlay panel', 'Per-game settings', 'Basic training drills', 'Community Discord'], cta: 'Join the Beta', href: '/signup?service=gamer-companion&tier=beta', popular: true },
  { tier: 'Pro', price: 19.99, period: '/mo', features: ['All 8 play modes', 'Autonomous + Mimic + Swarm', 'Pro player profiles', 'Advanced spray training', 'Session analytics', 'Priority support'], cta: 'Coming Soon', href: '#', popular: false },
  { tier: 'Team', price: 49.99, period: '/mo', features: ['Everything in Pro', 'Swarm mode (up to 5 players)', 'Team analytics dashboard', 'Scrim recording + review', 'Custom strategy builder', 'Dedicated server'], cta: 'Coming Soon', href: '#', popular: false },
];

const FAQS = [
  { q: 'Will this get me banned?', a: 'GGI Apex Predator uses human-like input patterns with Gaussian timing jitter, Bezier mouse curves, and variable key-hold durations. In Observe, Assist, and Coach modes, the AI never touches your inputs — it only reads the screen and gives advice. Higher modes (Autonomous, Mimic) carry inherent risk. The Safety Layer provides kill-switch (F12), APS limits, and session caps. Use responsibly and at your own discretion.' },
  { q: 'What games are supported?', a: 'We support 45+ games across FPS, MOBA, Battle Royale, RPG, Sports, Racing, Card, and Board game genres. Counter-Strike 2, Valorant, League of Legends, Dota 2, Chess, Fortnite, Apex Legends, and many more. New games are added regularly through our game registry system.' },
  { q: 'How does auto-detection work?', a: 'The daemon polls your running processes every 3 seconds and matches them against our game registry. It also queries the Steam API for active games. When a match is found, the correct AI profile, FSM, and settings load automatically. When you close the game, the session ends and stats are saved.' },
  { q: 'Does it work without Steam?', a: 'Yes. Steam integration enhances the experience (overlay browser, library detection), but the core daemon works with any game. Non-Steam games are detected via process name matching. Use --no-steam flag if you prefer.' },
  { q: 'What are the system requirements?', a: 'Windows 10/11 with Python 3.10+. 8GB RAM recommended. A dedicated GPU helps with screen analysis but is not required for basic modes. The daemon itself uses minimal resources (~50MB RAM, <1% CPU when idle).' },
  { q: 'Can I use it for Chess?', a: 'Absolutely. Chess has a dedicated FSM with opening book analysis, mid-game position evaluation, endgame tablebase lookups, and time management. The AI can analyze at depths beyond human capability while presenting moves in a coaching format.' },
  { q: 'Is the beta really free?', a: 'Yes. During the beta period, you get full access to Observe, Assist, Coach, and Training modes for all 45+ games. We are collecting feedback to improve the product before the full Pro launch. Beta testers will receive a permanent discount on Pro when it launches.' },
  { q: 'How do I access the control panel in-game?', a: 'Press Shift+Tab to open Steam Overlay, click "Web Browser", and navigate to localhost:27060. The full control panel loads with game status, mode switching, settings, and your game library. It auto-refreshes every 2 seconds.' },
];

function ComparisonCell({ value }: { value: boolean | string }) {
  if (value === true) return <span style={{ color: 'var(--ept-accent)' }} className="font-bold">Yes</span>;
  if (value === false) return <span style={{ color: 'var(--ept-text-muted)' }}>No</span>;
  return <span style={{ color: 'var(--ept-text-secondary)' }}>{value}</span>;
}

export default function GamerCompanionPage() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeGenre, setActiveGenre] = useState(0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium hidden sm:block" style={{ color: 'var(--ept-text-secondary)' }}>Pricing</Link>
          <Link href="/services" className="text-sm font-medium hidden sm:block" style={{ color: 'var(--ept-text-secondary)' }}>Services</Link>
          <Link href="/signup?service=gamer-companion&tier=beta" className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Join Beta</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-6 animate-fade-up" style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
          BETA — FREE ACCESS — JOIN NOW
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight gradient-text animate-fade-up">GGI Apex Predator</h1>
        <p className="text-xl md:text-2xl font-semibold mt-4 animate-fade-up-delay-1" style={{ color: 'var(--ept-text)' }}>AI Gaming Companion That Plays With You — Or For You</p>
        <p className="text-lg mt-6 max-w-2xl mx-auto animate-fade-up-delay-2" style={{ color: 'var(--ept-text-secondary)' }}>
          Auto-detects your game. Reads the screen. Coaches you in real-time. Or takes full autonomous control.
          45+ games. 8 play modes. One daemon to rule them all.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-10 animate-fade-up-delay-3">
          <Link href="/signup?service=gamer-companion&tier=beta" className="px-8 py-4 rounded-xl text-base font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Join the Free Beta</Link>
          <Link href="#modes" className="px-8 py-4 rounded-xl text-base font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>See Play Modes</Link>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mt-12" style={{ color: 'var(--ept-text-muted)' }}>
          <span className="text-sm">45+ Games</span>
          <span className="text-sm">8 Play Modes</span>
          <span className="text-sm">19 Game FSMs</span>
          <span className="text-sm">Steam Overlay Ready</span>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>How It Works</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>Install. Launch. Play. The AI handles everything else.</p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Install', desc: 'pip install gamer-companion. One command. All dependencies included. Works on Windows 10/11.' },
            { step: '2', title: 'Launch Daemon', desc: 'Run gamer-companion in your terminal. The daemon starts watching for game launches in the background.' },
            { step: '3', title: 'Play Your Game', desc: 'Launch any supported game normally. The AI auto-detects it, loads your settings, and activates the companion.' },
            { step: '4', title: 'Control In-Game', desc: 'Shift+Tab in Steam, open Web Browser, go to localhost:27060. Full control panel right inside your game.' },
          ].map((s, i) => (
            <div key={i} className="text-center p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-extrabold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>{s.step}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Everything a Gamer Needs</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>67 modules. 19 game-specific FSMs. Real computer vision. Not just another overlay.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-5 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <svg className="w-8 h-8 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--ept-accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
              </svg>
              <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--ept-text)' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Play Modes */}
      <section id="modes" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>8 Play Modes</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--ept-text-secondary)' }}>From silent observer to autonomous player. Choose your level of AI involvement.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLAY_MODES.map((m, i) => (
            <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                <h3 className="font-bold text-sm" style={{ color: 'var(--ept-text)' }}>{m.mode}</h3>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium" style={{
                  backgroundColor: m.risk === 'None' ? 'rgba(16,185,129,0.15)' : m.risk === 'Low' ? 'rgba(245,158,11,0.15)' : m.risk === 'Medium' ? 'rgba(249,115,22,0.15)' : 'rgba(239,68,68,0.15)',
                  color: m.risk === 'None' ? '#10b981' : m.risk === 'Low' ? '#f59e0b' : m.risk === 'Medium' ? '#f97316' : '#ef4444',
                }}>{m.risk} Risk</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ept-text-muted)' }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Games */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>45+ Supported Games</h2>
        <p className="text-center mb-8" style={{ color: 'var(--ept-text-secondary)' }}>Auto-detected on launch. Each game has a dedicated AI profile and finite state machine.</p>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {GAME_CATEGORIES.map((cat, i) => (
            <button key={i} onClick={() => setActiveGenre(i)} className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors" style={{
              backgroundColor: activeGenre === i ? 'var(--ept-accent)' : 'var(--ept-surface)',
              color: activeGenre === i ? '#fff' : 'var(--ept-text-secondary)',
            }}>{cat.genre}</button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {GAME_CATEGORIES[activeGenre].games.map((game, i) => (
            <span key={i} className="px-3 py-1.5 rounded-lg text-sm font-medium border" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)', color: 'var(--ept-text)' }}>{game}</span>
          ))}
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>How We Compare</h2>
        <p className="text-center mb-10" style={{ color: 'var(--ept-text-secondary)' }}>GGI Apex Predator is the only AI gaming companion with autonomous play, screen analysis, and pro mimicry.</p>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--ept-card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--ept-surface)' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ept-text)' }}>Feature</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-accent)' }}>GGI Apex</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Aim Lab</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Overwolf</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--ept-text-secondary)' }}>Manual Play</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: i % 2 === 0 ? 'var(--ept-card-bg)' : 'var(--ept-surface)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ept-text)' }}>{row.feature}</td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.ggi} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.aim_lab} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.overwolf} /></td>
                  <td className="px-4 py-3 text-center"><ComparisonCell value={row.manual} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y py-12 px-6" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '45+', label: 'Games Supported' },
            { value: '19', label: 'Game-Specific FSMs' },
            { value: '67', label: 'AI Modules' },
            { value: '8', label: 'Play Modes' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--ept-accent)' }}>{stat.value}</div>
              <div className="text-xs mt-1 font-medium" style={{ color: 'var(--ept-text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--ept-text)' }}>Pricing</h2>
        <p className="text-center mb-12" style={{ color: 'var(--ept-text-secondary)' }}>Free during beta. No credit card required. Pro tiers launching soon.</p>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PRICING.map((plan, i) => (
            <div key={i} className="relative p-6 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: plan.popular ? 'var(--ept-accent)' : 'var(--ept-card-border)', borderWidth: plan.popular ? 2 : 1 }}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Free Beta</span>
              )}
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--ept-text)' }}>{plan.tier}</h3>
              <div className="mb-4">
                <span className="text-3xl font-extrabold" style={{ color: 'var(--ept-text)' }}>{plan.price === 0 ? 'Free' : `$${plan.price}`}</span>
                <span className="text-sm ml-1" style={{ color: 'var(--ept-text-muted)' }}>{plan.period}</span>
              </div>
              <ul className="flex-1 space-y-2 mb-6">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-accent)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={`block text-center px-6 py-3 rounded-xl font-semibold ${plan.href === '#' ? 'opacity-60 pointer-events-none' : ''}`} style={{ backgroundColor: plan.popular ? 'var(--ept-accent)' : 'var(--ept-surface)', color: plan.popular ? '#fff' : 'var(--ept-text)' }}>{plan.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-5 py-4 flex items-center justify-between font-semibold text-sm" style={{ color: 'var(--ept-text)' }}>
                {faq.q}
                <svg className={`w-5 h-5 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-text-muted)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Beta CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-accent)', borderWidth: 2 }}>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3" style={{ color: 'var(--ept-text)' }}>Beta Testers Wanted</h3>
          <p className="text-sm leading-relaxed max-w-xl mx-auto mb-6" style={{ color: 'var(--ept-text-secondary)' }}>
            We are building the most advanced AI gaming companion ever created. Join the beta to get free access,
            shape the product with your feedback, and lock in a permanent discount when Pro launches.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup?service=gamer-companion&tier=beta" className="px-8 py-4 rounded-xl text-base font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>Join the Free Beta</Link>
            <a href="https://discord.gg/echo-prime" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-xl text-base font-semibold border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}>Join Discord</a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-6" style={{ color: 'var(--ept-text-muted)' }}>
            <span className="text-xs flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              No Credit Card
            </span>
            <span className="text-xs flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Full Access During Beta
            </span>
            <span className="text-xs flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Permanent Pro Discount
            </span>
            <span className="text-xs flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--ept-accent)' }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Shape the Product
            </span>
          </div>
        </div>
      </section>

      {/* ── Related Reading ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--ept-text)' }}>Related Reading</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/blog/ai-gaming-companion-competitive-advantage" className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>Blog</span>
            <h3 className="text-lg font-bold mt-2 mb-2" style={{ color: 'var(--ept-text)' }}>How AI Gaming Companions Give Competitive Players a Real Edge</h3>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>Real-time overlay stats, opponent pattern recognition, and build optimization.</p>
          </Link>
          <Link href="/blog/building-autonomous-ai-agents-2026" className="p-6 rounded-xl border card-hover" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ept-accent)' }}>Blog</span>
            <h3 className="text-lg font-bold mt-2 mb-2" style={{ color: 'var(--ept-text)' }}>Building Autonomous AI Agents in 2026</h3>
            <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>The architecture behind AI systems that observe, reason, and act independently.</p>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6 text-center" style={{ borderColor: 'var(--ept-border)' }}>
        <p className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>
          GGI Apex Predator by Echo Prime Technologies. Use responsibly. AI gaming assistance may violate certain game terms of service.
        </p>
        <div className="flex justify-center gap-4 mt-3">
          <Link href="/legal/terms" className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Terms</Link>
          <Link href="/legal/privacy" className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Privacy</Link>
          <Link href="/support" className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Support</Link>
          <Link href="/" className="text-xs" style={{ color: 'var(--ept-text-muted)' }}>Echo Prime</Link>
        </div>
      </footer>
    </div>
  );
}
