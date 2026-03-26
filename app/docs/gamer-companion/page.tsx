'use client'

import ProductDoc from '@/components/ProductDoc'

const data = {
  name: 'GGI Apex Predator',
  tagline: 'AI-powered gaming companion and esports coach — dominate every match with real-time analysis.',
  accent: '#dc2626',
  productUrl: '/gamer-companion',
  workerUrl: 'https://echo-gamer-companion.bmcii1976.workers.dev',
  version: '1.0.0',

  overview: [
    'GGI Apex Predator is the ultimate AI-powered gaming companion built for competitive players who refuse to plateau. Whether you grind ranked solo queue or compete on an organized esports roster, Apex Predator delivers real-time tactical intelligence that transforms raw gameplay into deliberate, optimized performance. The system ingests live game state data, cross-references it against millions of analyzed matches, and surfaces actionable recommendations — from optimal build paths and ability timings to opponent tendency predictions — all without interrupting your flow.',
    'At its core, Apex Predator combines a high-frequency game analysis engine with a persistent player profile that tracks your performance across sessions, patches, and metas. The AI identifies your strengths and weaknesses with surgical precision: maybe your early-game aggression is top-tier but your mid-game rotations cost you 12% of winnable fights, or your item builds are optimal 80% of the time but you default to comfort picks in high-pressure scenarios. Every data point feeds into personalized training regimens designed to close specific skill gaps on a measurable timeline.',
    'Beyond individual improvement, Apex Predator serves as a full-stack esports operations platform. Teams get opponent scouting reports generated from public match history, draft/ban phase analysis with win-rate projections for every composition, coordinated strategy playbooks with role-specific callouts, and post-match replays annotated with AI-identified decision points. Tournament preparation modules generate game plans tailored to specific opponents, and the meta tracker ensures your strategy stays current as patches shift the competitive landscape. From Bronze to Global Elite, from pickup games to LAN finals, Apex Predator is the coach that never sleeps.',
  ],

  gettingStarted: [
    { step: 1, title: 'Create Your Player Profile', desc: 'Sign up at echo-ept.com/gamer-companion and link your gaming accounts (Steam, Riot, Blizzard, Epic, Xbox, PlayStation). The system imports your match history to establish baseline performance metrics across all linked titles.' },
    { step: 2, title: 'Select Your Primary Games', desc: 'Choose the titles you want to track and improve in. Apex Predator currently supports League of Legends, Valorant, CS2, Dota 2, Apex Legends, Fortnite, Overwatch 2, and Rocket League. Each game has dedicated analysis models trained on millions of ranked matches.' },
    { step: 3, title: 'Install the Overlay Companion', desc: 'Download and install the lightweight desktop overlay application. The overlay runs in the background during matches, providing real-time recommendations via a configurable HUD element. It reads game state through approved APIs — no injection, no TOS violations, no anti-cheat flags.' },
    { step: 4, title: 'Run Your Calibration Matches', desc: 'Play 10 calibration matches with the overlay active. The AI observes your decision-making patterns, mechanical tendencies, and strategic preferences to build an accurate player model. After calibration, you receive your first comprehensive performance report with personalized improvement targets.' },
    { step: 5, title: 'Set Training Goals', desc: 'Define your competitive objectives — target rank, tournament timeline, specific skill milestones. Apex Predator generates a structured training regimen with daily drills, VOD review assignments, and measurable checkpoints. Progress tracking updates automatically after every session.' },
  ],

  features: [
    { title: 'Real-Time Game Analysis', desc: 'Live analysis during matches processes game state data at sub-second intervals. Receive contextual recommendations on positioning, ability usage, resource management, and engagement timing delivered through the non-intrusive overlay HUD without breaking your concentration.' },
    { title: 'Build Optimization', desc: 'AI-driven item, loadout, and skill build recommendations that adapt dynamically to the current game state. Factors include team composition, opponent builds, gold/resource differential, game phase, and win condition. Never default to a static build guide again.' },
    { title: 'Opponent Scouting', desc: 'Automated scouting reports generated from opponent match histories. Identifies playstyle tendencies, champion/agent pools, comfort picks, tilt patterns, peak performance hours, and statistical weaknesses. Available pre-match for ranked and pre-tournament for competitive play.' },
    { title: 'Performance Tracking', desc: 'Comprehensive stat tracking across every session with trend analysis over days, weeks, and patches. Tracks 200+ metrics per game including KDA curves, economy efficiency, objective participation, damage distribution, vision control, and custom composite scores.' },
    { title: 'Strategy Generation', desc: 'AI-generated game plans for specific matchups, compositions, and map scenarios. Strategies include phase-by-phase objectives, power spike timings, win condition identification, and contingency plans when behind. Updated automatically when patches shift the meta.' },
    { title: 'Replay Analysis', desc: 'Automated replay review that identifies critical decision points, mechanical errors, and missed opportunities. Each replay is annotated with timestamps, alternative plays, expected outcome differentials, and priority improvement areas ranked by impact on win rate.' },
    { title: 'Team Coordination', desc: 'Team-mode features for organized play including shared strategy boards, role-specific callout scripts, draft/ban phase simulations with win-rate projections, and coordinated practice schedules. Syncs across all team members with role-based permissions.' },
    { title: 'Meta Tracking', desc: 'Continuous monitoring of the competitive meta across all supported titles. Patch impact analysis within 24 hours of release, tier list updates based on win rate and pick rate data from high-elo play, and automated alerts when your main picks move between tiers.' },
    { title: 'Training Regimens', desc: 'Personalized daily training plans that target your specific weaknesses. Includes aim/mechanical drills, decision-making scenarios, VOD review assignments with focus questions, and custom game exercises. Difficulty scales automatically as you improve.' },
    { title: 'Tournament Preparation', desc: 'Dedicated tournament prep module that generates opponent-specific game plans, stage-appropriate strategies (group stage vs. elimination), mental preparation checklists, warmup routines, and post-match debrief templates. Covers preparation from one week out through match day.' },
    { title: 'Tilt Detection', desc: 'Behavioral analysis detects performance degradation patterns associated with tilt — declining accuracy, increasingly aggressive positioning, shortened decision windows. Automated cooldown recommendations prevent losing streaks from compounding.' },
    { title: 'Cross-Game Analytics', desc: 'Unified performance dashboard that tracks transferable skills across all linked games. Identifies mechanical strengths (reaction time, tracking aim) and strategic patterns (aggression index, risk tolerance) that persist across titles, helping you leverage existing skills in new games.' },
  ],

  apiEndpoints: [
    { method: 'GET', path: '/api/profile/:playerId', desc: 'Retrieve full player profile including linked accounts, performance metrics, rank history, calibration status, and active training goals.', auth: true },
    { method: 'GET', path: '/api/matches/:playerId', desc: 'List recent matches with detailed stats, AI analysis summaries, and performance grades. Supports filtering by game, date range, and match type.', auth: true },
    { method: 'POST', path: '/api/analysis/live', desc: 'Submit live game state snapshot for real-time analysis. Returns contextual recommendations for current game phase including build, positioning, and objective priority.', auth: true },
    { method: 'GET', path: '/api/scout/:opponentId', desc: 'Generate or retrieve a scouting report for a specific opponent. Includes playstyle profile, champion pool analysis, statistical weaknesses, and recommended counter-strategies.', auth: true },
    { method: 'POST', path: '/api/replay/analyze', desc: 'Submit a replay file or match ID for full AI analysis. Returns annotated timeline with decision points, errors, highlights, and improvement recommendations.', auth: true },
    { method: 'GET', path: '/api/meta/:game', desc: 'Retrieve current meta snapshot for a specific game including tier lists, win rates, pick rates, ban rates, and patch impact analysis. Updated every 6 hours.', auth: false },
    { method: 'GET', path: '/api/training/:playerId', desc: 'Retrieve the active training regimen including daily drills, progress checkpoints, and skill gap assessments. Returns next recommended training session.', auth: true },
    { method: 'POST', path: '/api/strategy/generate', desc: 'Generate a game plan for a specific matchup. Accepts team compositions, map, and opponent scouting data. Returns phase-by-phase strategy with role-specific instructions.', auth: true },
  ],

  userGuide: [
    {
      title: 'Real-Time Overlay Setup',
      id: 'overlay-setup',
      content: [
        'The Apex Predator overlay is a lightweight Electron application that runs alongside your game. After installation, launch the overlay before starting your game session. The overlay automatically detects supported titles and begins ingesting game state data through official APIs and screen analysis — no memory injection, no packet sniffing, no risk to your account standing.',
        'Configure the overlay position, opacity, and information density from the settings panel (Ctrl+Shift+A while in-game). Minimal mode shows only critical alerts like power spike timings and danger pings. Standard mode adds build recommendations and minimap annotations. Full mode includes the complete analysis sidebar with real-time stat differentials and win probability.',
        'The overlay communicates with the Apex Predator cloud backend via a persistent WebSocket connection. All analysis is performed server-side on dedicated GPU clusters, so the overlay adds negligible CPU/GPU overhead to your gaming machine. Latency between game state capture and recommendation delivery averages under 200ms on stable connections.',
      ],
    },
    {
      title: 'Performance Dashboard',
      id: 'performance-dashboard',
      content: [
        'The web dashboard at echo-ept.com/gamer-companion/dashboard is your central hub for performance tracking. The overview panel shows your current rank trajectory, recent match history with win/loss streaks, and your composite performance score trending over time. Click any match to drill into the full analysis with annotated replay timestamps.',
        'The Skills Breakdown panel decomposes your gameplay into measurable sub-skills: mechanics (aim accuracy, ability timing, combo execution), game sense (map awareness, rotation timing, information gathering), decision-making (engagement selection, resource allocation, objective priority), and teamplay (communication, role fulfillment, adaptation). Each sub-skill is scored on a percentile basis relative to your rank.',
        'Use the Trends tab to visualize performance changes over custom time ranges. Overlay patch dates to see how meta shifts affect your results. Compare your trajectory against the average improvement curve for your rank to gauge whether your training is producing above-average gains. Export any chart as PNG or CSV for sharing with coaches or teammates.',
      ],
    },
    {
      title: 'Team Mode & Scrimmages',
      id: 'team-mode',
      content: [
        'Create a team workspace by navigating to the Teams tab and inviting members via email or gamertag. Each team member links their individual profile, and the system generates a unified team dashboard showing composition strengths, role coverage, schedule overlap, and collective improvement metrics. Team admins can set shared goals and assign practice tasks.',
        'The draft simulator lets your team practice pick/ban phases against any opponent in your upcoming bracket. Input the opponent roster or let the system pull their public profiles, then run simulated drafts with AI playing the opponent side based on their historical pick tendencies. Each simulation outputs win probability, composition analysis, and recommended bans.',
        'Post-scrim review is streamlined through the team replay analyzer. Upload scrim replays and the AI generates a team-level analysis covering macro decisions (objective sequencing, rotation timing, resource allocation) alongside individual performance grades. Annotated timestamps highlight coordination successes and breakdowns so you can debrief efficiently without rewatching entire VODs.',
      ],
    },
    {
      title: 'Training & Improvement',
      id: 'training-improvement',
      content: [
        'After calibration, Apex Predator generates a personalized training regimen based on your performance gaps. Each day includes a mix of mechanical drills (aim trainers, combo practice), strategic exercises (VOD review with guided questions, scenario analysis), and ranked play with specific focus objectives. The system prioritizes the skills with the highest impact on your win rate.',
        'Progress checkpoints occur every 20 matches or 7 days, whichever comes first. The AI re-evaluates your skill profile, measures improvement against targets, and adjusts the training plan accordingly. If you are ahead of schedule on mechanical improvements but behind on game sense, the regimen shifts emphasis automatically. Stagnation triggers alternate training approaches.',
        'The Training History tab shows your complete improvement timeline with before/after metrics for each training cycle. Track which drills produced the most improvement, which skills responded fastest to practice, and which areas require sustained effort. This data helps you optimize not just what you practice, but how you practice for maximum efficiency.',
      ],
    },
  ],

  aiCapabilities: [
    { capability: 'Predictive Game State Modeling', desc: 'The AI maintains a forward-looking model of the current match state, projecting likely outcomes 30-60 seconds ahead based on current positioning, resource states, and historical patterns from millions of similar game states. This powers proactive recommendations — suggesting rotations before the enemy team initiates, or flagging resource thresholds that unlock power spikes.' },
    { capability: 'Behavioral Pattern Recognition', desc: 'Advanced pattern recognition identifies recurring behavioral tendencies in both the player and opponents. Detects habits like predictable peek timing, default rotation paths, comfort-pick bias, and tilt-triggered aggression shifts. For opponents, these patterns translate into exploitable predictions; for the player, they become targeted coaching points.' },
    { capability: 'Adaptive Difficulty Calibration', desc: 'Training recommendations dynamically calibrate to the player current skill level using a multi-dimensional Elo system that tracks 50+ sub-skills independently. Drills are neither too easy (wasted time) nor too hard (frustration without learning). The difficulty curve follows spaced repetition principles to maximize long-term skill retention.' },
    { capability: 'Natural Language Strategy Briefs', desc: 'All strategy documents, scouting reports, and analysis summaries are generated in clear, natural language — not raw stat dumps. The AI translates complex game theory into actionable instructions like "Contest the 3rd dragon only if you have ult advantage on 3+ members" rather than presenting abstract probability tables.' },
    { capability: 'Patch Impact Forecasting', desc: 'When game patches are announced, the AI simulates the likely impact on the competitive meta before the patch goes live. Predicts which characters/weapons/strategies will rise or fall in effectiveness, giving players a head start on adapting their pools and playstyles before the rest of the ladder catches up.' },
    { capability: 'Cross-Title Skill Transfer Analysis', desc: 'Identifies mechanical and strategic skills that transfer between games — FPS aim tracking applies from CS2 to Valorant, MOBA macro sense transfers from League to Dota 2. Recommends off-game training that reinforces primary game skills, and accelerates onboarding when players pick up a new competitive title.' },
  ],

  troubleshooting: [
    { issue: 'Overlay not detecting my game', solution: 'Ensure the game is running in borderless windowed or windowed mode — exclusive fullscreen blocks overlay rendering on some systems. Verify the game is in the supported titles list and that you have selected it in the overlay settings. Restart the overlay after launching the game if it was started first. Check that your GPU drivers are updated to the latest stable release.' },
    { issue: 'Real-time recommendations are delayed or missing', solution: 'Check your internet connection stability — the overlay requires a persistent WebSocket connection to the analysis backend. If on WiFi, try a wired connection for lower latency. Verify that your firewall is not blocking the overlay application. If delays persist, switch to "Lite Analysis" mode in overlay settings which reduces data throughput requirements.' },
    { issue: 'Match history not syncing from linked accounts', solution: 'Some platforms delay public match history availability by 5-15 minutes after a game ends. If matches are consistently missing, re-authenticate your linked account from Settings > Linked Accounts. For Riot and Steam accounts, ensure your match history privacy setting is set to public. The system cannot import matches played before your account was linked.' },
    { issue: 'Training regimen feels too easy or too hard', solution: 'Run a manual recalibration from Settings > Training > Recalibrate. Play 5 assessment matches with maximum effort and the AI will re-evaluate your skill profile. You can also manually adjust difficulty bias in training settings — shift the slider toward "Challenge" for harder drills or "Consistency" for reinforcement-focused practice.' },
  ],

  faq: [
    { q: 'Will using the overlay get my account banned?', a: 'No. The Apex Predator overlay reads game data exclusively through official APIs, screen capture, and publicly available match data. It does not inject code into game processes, modify game files, read game memory, or intercept network packets. It complies with the terms of service of all supported titles. The overlay is functionally equivalent to having a coach watch your screen and give verbal advice.' },
    { q: 'How many games does the AI need to build an accurate player profile?', a: 'The initial calibration requires 10 matches to establish baseline metrics. After 50 matches, the AI has high confidence in your skill profile across all major sub-categories. Performance tracking improves continuously — after 200+ matches, the system detects subtle tendencies that shorter data sets miss, like performance variation by time of day or opponent skill bracket.' },
    { q: 'Can I use Apex Predator for tournament play?', a: 'The real-time overlay is designed for ranked practice and online tournaments that permit coaching tools. For LAN tournaments or leagues that prohibit external software during matches, use the pre-match preparation features: opponent scouting reports, strategy generation, and draft simulation. Post-match replay analysis is always available regardless of tournament rules.' },
    { q: 'Does the system work for casual/unranked games?', a: 'Yes. While the analysis is optimized for competitive ranked play where opponent skill levels are calibrated, all features work in unranked modes. Performance tracking in casual modes uses adjusted metrics that account for the wider skill variance in unranked matchmaking. Training recommendations still apply regardless of the game mode you practice in.' },
    { q: 'How often is the meta tracker updated?', a: 'Meta snapshots refresh every 6 hours using data from the top 5% of ranked players across all supported regions. Patch impact analysis is published within 24 hours of a new patch going live, with preliminary projections available within 2 hours based on the AI patch simulator. Tier list changes trigger automated alerts if your main picks are affected.' },
  ],
}

export default function GamerCompanionDocsPage() {
  return <ProductDoc {...data} />
}
