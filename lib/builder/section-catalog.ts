// Section catalog — 45+ pre-built sections across 17 categories
// All HTML uses inline styles for GrapeJS iframe isolation

import { SectionDefinition, SectionCategory } from './types';

function sec(
  id: string,
  name: string,
  category: SectionCategory,
  description: string,
  thumbnail: string,
  html: string,
): SectionDefinition {
  return { id, name, category, description, thumbnail, html };
}

// ═══════════════════════════════════════════════════════════════
// HERO SECTIONS
// ═══════════════════════════════════════════════════════════════

const heroClassic = sec(
  'hero-classic',
  'Classic Centered Hero',
  'hero',
  'Large heading, subtitle, and CTA buttons centered on gradient background.',
  'linear-gradient(135deg, #1a1f2e 0%, #0f1219 100%)',
  `<section style="min-height:80vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:80px 24px;background:linear-gradient(135deg,#1a1f2e 0%,#0f1219 100%)">
  <div style="max-width:800px">
    <h1 style="font-size:clamp(2.5rem,5vw,4rem);font-weight:800;color:#e2e8f0;margin:0 0 20px;line-height:1.15">Build Something <span style="color:#C9A94E">Extraordinary</span></h1>
    <p style="font-size:clamp(1rem,2vw,1.25rem);color:#9ca3af;margin:0 0 36px;line-height:1.6">Create stunning websites, powerful apps, and intelligent systems — all from one platform.</p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
      <a href="#" style="padding:14px 32px;background:#C9A94E;color:#0f1219;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">Get Started Free</a>
      <a href="#" style="padding:14px 32px;border:1px solid #2a2f3e;color:#e2e8f0;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">Watch Demo</a>
    </div>
  </div>
</section>`,
);

const heroSplit = sec(
  'hero-split',
  'Split Hero (Image + Text)',
  'hero',
  'Left-side content with right-side image placeholder.',
  'linear-gradient(90deg, #1a1f2e 50%, #0f1219 50%)',
  `<section style="display:flex;flex-wrap:wrap;min-height:80vh;background:#0f1219">
  <div style="flex:1;min-width:320px;display:flex;align-items:center;padding:60px 48px">
    <div style="max-width:560px">
      <span style="display:inline-block;padding:6px 14px;background:#C9A94E22;color:#C9A94E;border-radius:20px;font-size:13px;font-weight:600;margin-bottom:20px">NEW RELEASE</span>
      <h1 style="font-size:clamp(2rem,4vw,3.5rem);font-weight:800;color:#e2e8f0;margin:0 0 20px;line-height:1.15">The Future of Web Development</h1>
      <p style="font-size:18px;color:#9ca3af;margin:0 0 32px;line-height:1.7">Harness the power of AI to build, deploy, and scale your web presence in minutes, not months.</p>
      <a href="#" style="display:inline-block;padding:14px 32px;background:#C9A94E;color:#0f1219;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">Start Building</a>
    </div>
  </div>
  <div style="flex:1;min-width:320px;display:flex;align-items:center;justify-content:center;padding:40px;background:#1a1f2e">
    <img src="https://placehold.co/560x400/1a1f2e/C9A94E?text=Hero+Image" alt="Hero" style="width:100%;max-width:560px;border-radius:12px" />
  </div>
</section>`,
);

const heroGradient = sec(
  'hero-gradient',
  'Animated Gradient Hero',
  'hero',
  'Bold hero with animated gradient background and floating elements.',
  'linear-gradient(135deg, #C9A94E33 0%, #1a1f2e 50%, #14b8a633 100%)',
  `<section style="min-height:85vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:80px 24px;background:linear-gradient(135deg,#0f1219 0%,#1a1f2e 40%,#0f1219 100%);position:relative;overflow:hidden">
  <div style="position:absolute;top:10%;left:10%;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,#C9A94E11,transparent 70%);filter:blur(60px)"></div>
  <div style="position:absolute;bottom:10%;right:10%;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,#14b8a611,transparent 70%);filter:blur(80px)"></div>
  <div style="position:relative;max-width:900px;z-index:1">
    <h1 style="font-size:clamp(2.5rem,6vw,4.5rem);font-weight:900;color:#e2e8f0;margin:0 0 24px;line-height:1.1;letter-spacing:-0.02em">Next-Generation <span style="background:linear-gradient(135deg,#C9A94E,#14b8a6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">AI Platform</span></h1>
    <p style="font-size:20px;color:#9ca3af;margin:0 0 40px;line-height:1.7;max-width:600px;margin-left:auto;margin-right:auto">Autonomous intelligence that builds, deploys, and scales — so you can focus on what matters.</p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
      <a href="#" style="padding:16px 36px;background:#C9A94E;color:#0f1219;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;box-shadow:0 4px 20px #C9A94E33">Start Free Trial</a>
      <a href="#" style="padding:16px 36px;border:1px solid #2a2f3e;color:#e2e8f0;border-radius:10px;text-decoration:none;font-weight:600;font-size:16px;backdrop-filter:blur(10px);background:#ffffff08">Learn More</a>
    </div>
  </div>
</section>`,
);

const heroApp = sec(
  'hero-app',
  'App Showcase Hero',
  'hero',
  'Hero with app screenshot/mockup and feature badges.',
  'linear-gradient(180deg, #1a1f2e 0%, #0f1219 100%)',
  `<section style="padding:80px 24px;background:#0f1219;text-align:center">
  <div style="max-width:1100px;margin:0 auto">
    <div style="display:flex;gap:8px;justify-content:center;margin-bottom:24px;flex-wrap:wrap">
      <span style="padding:4px 12px;border-radius:20px;background:#C9A94E22;color:#C9A94E;font-size:12px;font-weight:600">AI-Powered</span>
      <span style="padding:4px 12px;border-radius:20px;background:#14b8a622;color:#14b8a6;font-size:12px;font-weight:600">Real-Time</span>
      <span style="padding:4px 12px;border-radius:20px;background:#a855f722;color:#a855f7;font-size:12px;font-weight:600">Enterprise Ready</span>
    </div>
    <h1 style="font-size:clamp(2rem,5vw,3.5rem);font-weight:800;color:#e2e8f0;margin:0 0 16px">Your Command Center for Everything</h1>
    <p style="font-size:18px;color:#9ca3af;margin:0 0 48px;max-width:600px;margin-left:auto;margin-right:auto">Monitor, manage, and deploy from a single dashboard built for speed.</p>
    <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:16px;padding:8px;max-width:900px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,0.5)">
      <img src="https://placehold.co/900x500/0f1219/2a2f3e?text=App+Dashboard" alt="Dashboard" style="width:100%;border-radius:12px;display:block" />
    </div>
  </div>
</section>`,
);

// ═══════════════════════════════════════════════════════════════
// NAVIGATION SECTIONS
// ═══════════════════════════════════════════════════════════════

const navSimple = sec(
  'nav-simple',
  'Simple Navbar',
  'navigation',
  'Clean top navigation with logo, links, and CTA button.',
  'linear-gradient(90deg, #1a1f2e 0%, #0f1219 100%)',
  `<nav style="display:flex;align-items:center;justify-content:space-between;padding:16px 32px;background:#0f1219;border-bottom:1px solid #2a2f3e">
  <div style="font-size:20px;font-weight:800;color:#C9A94E;letter-spacing:-0.02em">YourBrand</div>
  <div style="display:flex;align-items:center;gap:32px">
    <a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px;font-weight:500">Features</a>
    <a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px;font-weight:500">Pricing</a>
    <a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px;font-weight:500">About</a>
    <a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px;font-weight:500">Contact</a>
    <a href="#" style="padding:10px 20px;background:#C9A94E;color:#0f1219;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">Get Started</a>
  </div>
</nav>`,
);

const navMega = sec(
  'nav-mega',
  'Mega Menu Navbar',
  'navigation',
  'Full-width navbar with dropdown mega menu areas.',
  'linear-gradient(90deg, #0f1219 0%, #1a1f2e 100%)',
  `<nav style="padding:16px 32px;background:#0f1219;border-bottom:1px solid #2a2f3e">
  <div style="display:flex;align-items:center;justify-content:space-between;max-width:1200px;margin:0 auto">
    <div style="display:flex;align-items:center;gap:40px">
      <div style="font-size:20px;font-weight:800;color:#C9A94E">YourBrand</div>
      <div style="display:flex;gap:28px">
        <a href="#" style="color:#e2e8f0;text-decoration:none;font-size:14px;font-weight:600">Products</a>
        <a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px;font-weight:500">Solutions</a>
        <a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px;font-weight:500">Resources</a>
        <a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px;font-weight:500">Pricing</a>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:16px">
      <a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Sign In</a>
      <a href="#" style="padding:10px 20px;background:#C9A94E;color:#0f1219;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">Free Trial</a>
    </div>
  </div>
</nav>`,
);

// ═══════════════════════════════════════════════════════════════
// FEATURES SECTIONS
// ═══════════════════════════════════════════════════════════════

const features3Col = sec(
  'features-3col',
  '3-Column Feature Cards',
  'features',
  'Three feature cards in a row with icons and descriptions.',
  'linear-gradient(180deg, #0f1219 0%, #1a1f2e 100%)',
  `<section style="padding:80px 24px;background:#0f1219">
  <div style="max-width:1100px;margin:0 auto;text-align:center">
    <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:#e2e8f0;margin:0 0 12px">Powerful Features</h2>
    <p style="font-size:16px;color:#9ca3af;margin:0 0 48px;max-width:600px;margin-left:auto;margin-right:auto">Everything you need to build, deploy, and scale your digital presence.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px">
      <div style="padding:32px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;text-align:left">
        <div style="width:48px;height:48px;border-radius:10px;background:#C9A94E22;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:20px">&#9889;</div>
        <h3 style="font-size:18px;font-weight:700;color:#e2e8f0;margin:0 0 8px">Lightning Fast</h3>
        <p style="font-size:14px;color:#9ca3af;margin:0;line-height:1.6">Sub-50ms response times globally. Built on edge infrastructure with zero cold starts.</p>
      </div>
      <div style="padding:32px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;text-align:left">
        <div style="width:48px;height:48px;border-radius:10px;background:#14b8a622;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:20px">&#128274;</div>
        <h3 style="font-size:18px;font-weight:700;color:#e2e8f0;margin:0 0 8px">Enterprise Security</h3>
        <p style="font-size:14px;color:#9ca3af;margin:0;line-height:1.6">SOC 2 compliant, end-to-end encryption, and role-based access controls built in.</p>
      </div>
      <div style="padding:32px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;text-align:left">
        <div style="width:48px;height:48px;border-radius:10px;background:#a855f722;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:20px">&#129302;</div>
        <h3 style="font-size:18px;font-weight:700;color:#e2e8f0;margin:0 0 8px">AI-Powered</h3>
        <p style="font-size:14px;color:#9ca3af;margin:0;line-height:1.6">Intelligent automation that learns, adapts, and builds alongside you.</p>
      </div>
    </div>
  </div>
</section>`,
);

const featuresAlternating = sec(
  'features-alternating',
  'Alternating Image + Text',
  'features',
  'Features shown with alternating image and text rows.',
  'linear-gradient(180deg, #1a1f2e 0%, #0f1219 100%)',
  `<section style="padding:80px 24px;background:#0f1219">
  <div style="max-width:1000px;margin:0 auto;display:flex;flex-direction:column;gap:64px">
    <div style="display:flex;flex-wrap:wrap;gap:40px;align-items:center">
      <div style="flex:1;min-width:280px"><img src="https://placehold.co/480x320/1a1f2e/C9A94E?text=Feature+1" alt="Feature" style="width:100%;border-radius:12px" /></div>
      <div style="flex:1;min-width:280px">
        <span style="color:#C9A94E;font-weight:700;font-size:13px;letter-spacing:0.06em;text-transform:uppercase">Performance</span>
        <h3 style="font-size:28px;font-weight:800;color:#e2e8f0;margin:8px 0 12px">Blazing Fast Delivery</h3>
        <p style="font-size:16px;color:#9ca3af;line-height:1.7;margin:0">Optimized for speed with edge caching, image optimization, and lazy loading built into every page.</p>
      </div>
    </div>
    <div style="display:flex;flex-wrap:wrap-reverse;gap:40px;align-items:center">
      <div style="flex:1;min-width:280px">
        <span style="color:#14b8a6;font-weight:700;font-size:13px;letter-spacing:0.06em;text-transform:uppercase">Analytics</span>
        <h3 style="font-size:28px;font-weight:800;color:#e2e8f0;margin:8px 0 12px">Real-Time Insights</h3>
        <p style="font-size:16px;color:#9ca3af;line-height:1.7;margin:0">Track visitor behavior, conversion funnels, and performance metrics with built-in analytics dashboards.</p>
      </div>
      <div style="flex:1;min-width:280px"><img src="https://placehold.co/480x320/1a1f2e/14b8a6?text=Feature+2" alt="Feature" style="width:100%;border-radius:12px" /></div>
    </div>
  </div>
</section>`,
);

const featuresBento = sec(
  'features-bento',
  'Bento Grid Features',
  'features',
  'Modern bento-style grid layout with mixed-size feature cards.',
  'linear-gradient(180deg, #0f1219 0%, #1a1f2e 100%)',
  `<section style="padding:80px 24px;background:#0f1219">
  <div style="max-width:1100px;margin:0 auto">
    <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:#e2e8f0;margin:0 0 48px;text-align:center">Why Choose Us</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:auto auto;gap:16px">
      <div style="grid-column:span 2;padding:40px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:16px">
        <h3 style="font-size:22px;font-weight:700;color:#e2e8f0;margin:0 0 12px">AI-Driven Development</h3>
        <p style="font-size:15px;color:#9ca3af;margin:0;line-height:1.6">Our AI builds complete applications from natural language descriptions. Just describe what you need — we generate production-ready code.</p>
      </div>
      <div style="padding:40px;background:linear-gradient(135deg,#C9A94E22,#C9A94E05);border:1px solid #C9A94E33;border-radius:16px">
        <div style="font-size:40px;font-weight:900;color:#C9A94E;margin-bottom:8px">99.9%</div>
        <p style="font-size:14px;color:#9ca3af;margin:0">Uptime guaranteed</p>
      </div>
      <div style="padding:40px;background:linear-gradient(135deg,#14b8a622,#14b8a605);border:1px solid #14b8a633;border-radius:16px">
        <div style="font-size:40px;font-weight:900;color:#14b8a6;margin-bottom:8px">&lt;50ms</div>
        <p style="font-size:14px;color:#9ca3af;margin:0">Global response time</p>
      </div>
      <div style="grid-column:span 2;padding:40px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:16px">
        <h3 style="font-size:22px;font-weight:700;color:#e2e8f0;margin:0 0 12px">Scale Without Limits</h3>
        <p style="font-size:15px;color:#9ca3af;margin:0;line-height:1.6">From startup to enterprise, our infrastructure auto-scales to handle any volume. No capacity planning required.</p>
      </div>
    </div>
  </div>
</section>`,
);

// ═══════════════════════════════════════════════════════════════
// PRICING SECTIONS
// ═══════════════════════════════════════════════════════════════

const pricing3Tier = sec(
  'pricing-3tier',
  '3-Tier Pricing Cards',
  'pricing',
  'Three pricing plans with a highlighted recommended tier.',
  'linear-gradient(180deg, #0f1219 0%, #1a1f2e 100%)',
  `<section style="padding:80px 24px;background:#0f1219">
  <div style="max-width:1100px;margin:0 auto;text-align:center">
    <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:#e2e8f0;margin:0 0 12px">Simple, Transparent Pricing</h2>
    <p style="font-size:16px;color:#9ca3af;margin:0 0 48px">Start free. Scale as you grow. No hidden fees.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;max-width:960px;margin:0 auto">
      <div style="padding:32px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:16px;text-align:left">
        <h3 style="font-size:18px;font-weight:700;color:#e2e8f0;margin:0 0 4px">Starter</h3>
        <p style="font-size:13px;color:#9ca3af;margin:0 0 20px">For individuals and small projects</p>
        <div style="margin-bottom:24px"><span style="font-size:40px;font-weight:900;color:#e2e8f0">$0</span><span style="color:#9ca3af;font-size:14px">/month</span></div>
        <ul style="list-style:none;padding:0;margin:0 0 28px;display:flex;flex-direction:column;gap:10px;font-size:14px;color:#9ca3af">
          <li>&#10003; 1 website</li><li>&#10003; 5 pages</li><li>&#10003; Basic analytics</li><li>&#10003; Community support</li>
        </ul>
        <a href="#" style="display:block;text-align:center;padding:12px;border:1px solid #2a2f3e;color:#e2e8f0;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Get Started</a>
      </div>
      <div style="padding:32px;background:#1a1f2e;border:2px solid #C9A94E;border-radius:16px;text-align:left;position:relative">
        <span style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);padding:4px 16px;background:#C9A94E;color:#0f1219;border-radius:20px;font-size:12px;font-weight:700">POPULAR</span>
        <h3 style="font-size:18px;font-weight:700;color:#e2e8f0;margin:0 0 4px">Professional</h3>
        <p style="font-size:13px;color:#9ca3af;margin:0 0 20px">For growing businesses</p>
        <div style="margin-bottom:24px"><span style="font-size:40px;font-weight:900;color:#e2e8f0">$29</span><span style="color:#9ca3af;font-size:14px">/month</span></div>
        <ul style="list-style:none;padding:0;margin:0 0 28px;display:flex;flex-direction:column;gap:10px;font-size:14px;color:#9ca3af">
          <li>&#10003; 10 websites</li><li>&#10003; Unlimited pages</li><li>&#10003; Advanced analytics</li><li>&#10003; Priority support</li><li>&#10003; Custom domain</li>
        </ul>
        <a href="#" style="display:block;text-align:center;padding:12px;background:#C9A94E;color:#0f1219;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">Start Free Trial</a>
      </div>
      <div style="padding:32px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:16px;text-align:left">
        <h3 style="font-size:18px;font-weight:700;color:#e2e8f0;margin:0 0 4px">Enterprise</h3>
        <p style="font-size:13px;color:#9ca3af;margin:0 0 20px">For large organizations</p>
        <div style="margin-bottom:24px"><span style="font-size:40px;font-weight:900;color:#e2e8f0">$99</span><span style="color:#9ca3af;font-size:14px">/month</span></div>
        <ul style="list-style:none;padding:0;margin:0 0 28px;display:flex;flex-direction:column;gap:10px;font-size:14px;color:#9ca3af">
          <li>&#10003; Unlimited websites</li><li>&#10003; Team collaboration</li><li>&#10003; White-label</li><li>&#10003; 24/7 support</li><li>&#10003; SLA guarantee</li>
        </ul>
        <a href="#" style="display:block;text-align:center;padding:12px;border:1px solid #2a2f3e;color:#e2e8f0;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Contact Sales</a>
      </div>
    </div>
  </div>
</section>`,
);

// ═══════════════════════════════════════════════════════════════
// TESTIMONIALS SECTIONS
// ═══════════════════════════════════════════════════════════════

const testimonialsGrid = sec(
  'testimonials-grid',
  'Testimonial Grid Cards',
  'testimonials',
  'Grid of testimonial cards with quote, name, and role.',
  'linear-gradient(180deg, #1a1f2e 0%, #0f1219 100%)',
  `<section style="padding:80px 24px;background:#0f1219">
  <div style="max-width:1100px;margin:0 auto;text-align:center">
    <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:#e2e8f0;margin:0 0 48px">Loved by Thousands</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px">
      <div style="padding:28px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;text-align:left">
        <div style="color:#C9A94E;font-size:24px;margin-bottom:12px">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p style="font-size:15px;color:#e2e8f0;line-height:1.6;margin:0 0 20px">"This platform completely transformed how we build websites. The AI builder is genuinely magical."</p>
        <div style="display:flex;align-items:center;gap:12px"><div style="width:40px;height:40px;border-radius:50%;background:#C9A94E33"></div><div><div style="font-size:14px;font-weight:600;color:#e2e8f0">Sarah Chen</div><div style="font-size:12px;color:#9ca3af">CEO, TechStart</div></div></div>
      </div>
      <div style="padding:28px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;text-align:left">
        <div style="color:#C9A94E;font-size:24px;margin-bottom:12px">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p style="font-size:15px;color:#e2e8f0;line-height:1.6;margin:0 0 20px">"We went from concept to production in 2 hours. I'm not exaggerating. This is the future."</p>
        <div style="display:flex;align-items:center;gap:12px"><div style="width:40px;height:40px;border-radius:50%;background:#14b8a633"></div><div><div style="font-size:14px;font-weight:600;color:#e2e8f0">James Miller</div><div style="font-size:12px;color:#9ca3af">CTO, GrowthLabs</div></div></div>
      </div>
      <div style="padding:28px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;text-align:left">
        <div style="color:#C9A94E;font-size:24px;margin-bottom:12px">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p style="font-size:15px;color:#e2e8f0;line-height:1.6;margin:0 0 20px">"Best investment we made this year. Replaced our entire web team with one platform."</p>
        <div style="display:flex;align-items:center;gap:12px"><div style="width:40px;height:40px;border-radius:50%;background:#a855f733"></div><div><div style="font-size:14px;font-weight:600;color:#e2e8f0">Alex Rivera</div><div style="font-size:12px;color:#9ca3af">Founder, DesignCo</div></div></div>
      </div>
    </div>
  </div>
</section>`,
);

// ═══════════════════════════════════════════════════════════════
// CTA SECTIONS
// ═══════════════════════════════════════════════════════════════

const ctaCentered = sec(
  'cta-centered',
  'Centered CTA Banner',
  'cta',
  'Full-width call-to-action with heading and button.',
  'linear-gradient(135deg, #C9A94E22 0%, #1a1f2e 100%)',
  `<section style="padding:80px 24px;background:linear-gradient(135deg,#1a1f2e,#0f1219);text-align:center">
  <div style="max-width:700px;margin:0 auto">
    <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:#e2e8f0;margin:0 0 16px">Ready to Get Started?</h2>
    <p style="font-size:17px;color:#9ca3af;margin:0 0 32px;line-height:1.6">Join thousands of creators building stunning websites with AI. Free to start, no credit card required.</p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
      <a href="#" style="padding:14px 36px;background:#C9A94E;color:#0f1219;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">Start Building Free</a>
      <a href="#" style="padding:14px 36px;border:1px solid #2a2f3e;color:#e2e8f0;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">Schedule Demo</a>
    </div>
  </div>
</section>`,
);

const ctaSplit = sec(
  'cta-split',
  'Split CTA with Image',
  'cta',
  'CTA with text on one side and image on the other.',
  'linear-gradient(90deg, #C9A94E11 0%, #1a1f2e 50%)',
  `<section style="padding:60px 24px;background:#1a1f2e">
  <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:40px;border-radius:16px;overflow:hidden">
    <div style="flex:1;min-width:300px;padding:20px">
      <h2 style="font-size:28px;font-weight:800;color:#e2e8f0;margin:0 0 12px">Start Your Free Trial Today</h2>
      <p style="font-size:16px;color:#9ca3af;margin:0 0 24px;line-height:1.6">No credit card needed. Build your first website in under 5 minutes.</p>
      <a href="#" style="display:inline-block;padding:14px 32px;background:#C9A94E;color:#0f1219;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">Get Started</a>
    </div>
    <div style="flex:1;min-width:300px"><img src="https://placehold.co/500x300/0f1219/C9A94E?text=CTA+Image" alt="CTA" style="width:100%;border-radius:12px;display:block" /></div>
  </div>
</section>`,
);

// ═══════════════════════════════════════════════════════════════
// CONTACT SECTIONS
// ═══════════════════════════════════════════════════════════════

const contactForm = sec(
  'contact-form',
  'Contact Form',
  'contact',
  'Simple contact form with name, email, and message fields.',
  'linear-gradient(180deg, #0f1219 0%, #1a1f2e 100%)',
  `<section style="padding:80px 24px;background:#0f1219">
  <div style="max-width:600px;margin:0 auto;text-align:center">
    <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:#e2e8f0;margin:0 0 12px">Get in Touch</h2>
    <p style="font-size:16px;color:#9ca3af;margin:0 0 36px">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
    <form style="display:flex;flex-direction:column;gap:16px;text-align:left">
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        <input type="text" placeholder="First Name" style="flex:1;min-width:200px;padding:12px 16px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:8px;color:#e2e8f0;font-size:14px;outline:none" />
        <input type="text" placeholder="Last Name" style="flex:1;min-width:200px;padding:12px 16px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:8px;color:#e2e8f0;font-size:14px;outline:none" />
      </div>
      <input type="email" placeholder="Email Address" style="padding:12px 16px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:8px;color:#e2e8f0;font-size:14px;outline:none" />
      <textarea placeholder="Your Message" rows="5" style="padding:12px 16px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:8px;color:#e2e8f0;font-size:14px;outline:none;resize:vertical"></textarea>
      <button type="submit" style="padding:14px;background:#C9A94E;color:#0f1219;border:none;border-radius:8px;font-weight:700;font-size:16px;cursor:pointer">Send Message</button>
    </form>
  </div>
</section>`,
);

const contactCards = sec(
  'contact-cards',
  'Contact Info Cards',
  'contact',
  'Contact cards showing email, phone, and address.',
  'linear-gradient(180deg, #1a1f2e 0%, #0f1219 100%)',
  `<section style="padding:80px 24px;background:#0f1219">
  <div style="max-width:900px;margin:0 auto;text-align:center">
    <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:#e2e8f0;margin:0 0 48px">Contact Us</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px">
      <div style="padding:32px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px">
        <div style="font-size:28px;margin-bottom:12px">&#9993;</div>
        <h3 style="font-size:16px;font-weight:700;color:#e2e8f0;margin:0 0 8px">Email</h3>
        <p style="font-size:14px;color:#9ca3af;margin:0">hello@yourbrand.com</p>
      </div>
      <div style="padding:32px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px">
        <div style="font-size:28px;margin-bottom:12px">&#9742;</div>
        <h3 style="font-size:16px;font-weight:700;color:#e2e8f0;margin:0 0 8px">Phone</h3>
        <p style="font-size:14px;color:#9ca3af;margin:0">+1 (555) 123-4567</p>
      </div>
      <div style="padding:32px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px">
        <div style="font-size:28px;margin-bottom:12px">&#128205;</div>
        <h3 style="font-size:16px;font-weight:700;color:#e2e8f0;margin:0 0 8px">Office</h3>
        <p style="font-size:14px;color:#9ca3af;margin:0">123 Main St, Suite 100</p>
      </div>
    </div>
  </div>
</section>`,
);

// ═══════════════════════════════════════════════════════════════
// FOOTER SECTIONS
// ═══════════════════════════════════════════════════════════════

const footerMultiCol = sec(
  'footer-multicol',
  'Multi-Column Footer',
  'footer',
  'Professional footer with multiple link columns and copyright.',
  'linear-gradient(180deg, #1a1f2e 0%, #0f1219 100%)',
  `<footer style="padding:60px 24px 32px;background:#0f1219;border-top:1px solid #2a2f3e">
  <div style="max-width:1100px;margin:0 auto">
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px">
      <div>
        <div style="font-size:20px;font-weight:800;color:#C9A94E;margin-bottom:16px">YourBrand</div>
        <p style="font-size:14px;color:#9ca3af;line-height:1.6;margin:0;max-width:280px">Building the future of web development with AI-powered tools and edge infrastructure.</p>
      </div>
      <div>
        <h4 style="font-size:13px;font-weight:700;color:#e2e8f0;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.06em">Product</h4>
        <div style="display:flex;flex-direction:column;gap:10px"><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Features</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Pricing</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Templates</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Integrations</a></div>
      </div>
      <div>
        <h4 style="font-size:13px;font-weight:700;color:#e2e8f0;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.06em">Company</h4>
        <div style="display:flex;flex-direction:column;gap:10px"><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">About</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Blog</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Careers</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Contact</a></div>
      </div>
      <div>
        <h4 style="font-size:13px;font-weight:700;color:#e2e8f0;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.06em">Legal</h4>
        <div style="display:flex;flex-direction:column;gap:10px"><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Privacy</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Terms</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Cookies</a></div>
      </div>
    </div>
    <div style="border-top:1px solid #2a2f3e;padding-top:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <p style="font-size:13px;color:#9ca3af;margin:0">&copy; 2026 YourBrand. All rights reserved.</p>
      <div style="display:flex;gap:16px"><a href="#" style="color:#9ca3af;text-decoration:none;font-size:13px">Twitter</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:13px">GitHub</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:13px">LinkedIn</a></div>
    </div>
  </div>
</footer>`,
);

const footerSimple = sec(
  'footer-simple',
  'Simple Centered Footer',
  'footer',
  'Minimal footer with centered links and copyright.',
  'linear-gradient(180deg, #0f1219 0%, #1a1f2e 100%)',
  `<footer style="padding:40px 24px;background:#0f1219;border-top:1px solid #2a2f3e;text-align:center">
  <div style="display:flex;gap:24px;justify-content:center;margin-bottom:16px;flex-wrap:wrap">
    <a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Home</a>
    <a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Features</a>
    <a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Pricing</a>
    <a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Privacy</a>
    <a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Terms</a>
  </div>
  <p style="font-size:13px;color:#9ca3af;margin:0">&copy; 2026 YourBrand. All rights reserved.</p>
</footer>`,
);

// ═══════════════════════════════════════════════════════════════
// FAQ SECTIONS
// ═══════════════════════════════════════════════════════════════

const faqAccordion = sec(
  'faq-accordion',
  'FAQ Accordion',
  'faq',
  'Expandable FAQ items with toggle functionality.',
  'linear-gradient(180deg, #0f1219 0%, #1a1f2e 100%)',
  `<section style="padding:80px 24px;background:#0f1219">
  <div style="max-width:740px;margin:0 auto">
    <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:#e2e8f0;margin:0 0 48px;text-align:center">Frequently Asked Questions</h2>
    <div style="display:flex;flex-direction:column;gap:12px">
      <details style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:10px;overflow:hidden">
        <summary style="padding:16px 20px;color:#e2e8f0;font-weight:600;font-size:15px;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center">How does the AI builder work?<span style="color:#C9A94E">+</span></summary>
        <div style="padding:0 20px 16px;font-size:14px;color:#9ca3af;line-height:1.6">Simply describe the website you want in plain English. Our AI generates a complete, responsive website with professional design, proper structure, and clean code — usually in under 30 seconds.</div>
      </details>
      <details style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:10px;overflow:hidden">
        <summary style="padding:16px 20px;color:#e2e8f0;font-weight:600;font-size:15px;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center">Can I customize the generated website?<span style="color:#C9A94E">+</span></summary>
        <div style="padding:0 20px 16px;font-size:14px;color:#9ca3af;line-height:1.6">Absolutely! After generation, you can edit every element using our visual editor, ask the AI to make specific changes, or modify the HTML/CSS directly. Full creative control.</div>
      </details>
      <details style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:10px;overflow:hidden">
        <summary style="padding:16px 20px;color:#e2e8f0;font-weight:600;font-size:15px;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center">Do I need coding experience?<span style="color:#C9A94E">+</span></summary>
        <div style="padding:0 20px 16px;font-size:14px;color:#9ca3af;line-height:1.6">No coding required. The AI handles all the technical work. If you're a developer, you can access the code directly — but it's completely optional.</div>
      </details>
      <details style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:10px;overflow:hidden">
        <summary style="padding:16px 20px;color:#e2e8f0;font-weight:600;font-size:15px;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center">What about hosting and domains?<span style="color:#C9A94E">+</span></summary>
        <div style="padding:0 20px 16px;font-size:14px;color:#9ca3af;line-height:1.6">We handle hosting on our global edge network. You can use our free subdomain or connect your own custom domain. SSL certificates are included with every plan.</div>
      </details>
    </div>
  </div>
</section>`,
);

// ═══════════════════════════════════════════════════════════════
// TEAM SECTIONS
// ═══════════════════════════════════════════════════════════════

const teamGrid = sec(
  'team-grid',
  'Team Grid Cards',
  'team',
  'Team members in a responsive grid with photos and roles.',
  'linear-gradient(180deg, #0f1219 0%, #1a1f2e 100%)',
  `<section style="padding:80px 24px;background:#0f1219">
  <div style="max-width:1000px;margin:0 auto;text-align:center">
    <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:#e2e8f0;margin:0 0 12px">Meet the Team</h2>
    <p style="font-size:16px;color:#9ca3af;margin:0 0 48px">The people building the future of web development.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px">
      <div style="padding:28px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px">
        <img src="https://placehold.co/120x120/2a2f3e/e2e8f0?text=JD" alt="Team" style="width:80px;height:80px;border-radius:50%;margin-bottom:16px" />
        <h3 style="font-size:16px;font-weight:700;color:#e2e8f0;margin:0 0 4px">John Doe</h3>
        <p style="font-size:13px;color:#C9A94E;margin:0 0 8px;font-weight:600">CEO & Founder</p>
        <p style="font-size:13px;color:#9ca3af;margin:0">20+ years in tech leadership and enterprise software.</p>
      </div>
      <div style="padding:28px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px">
        <img src="https://placehold.co/120x120/2a2f3e/e2e8f0?text=JS" alt="Team" style="width:80px;height:80px;border-radius:50%;margin-bottom:16px" />
        <h3 style="font-size:16px;font-weight:700;color:#e2e8f0;margin:0 0 4px">Jane Smith</h3>
        <p style="font-size:13px;color:#14b8a6;margin:0 0 8px;font-weight:600">CTO</p>
        <p style="font-size:13px;color:#9ca3af;margin:0">AI/ML architect with a passion for distributed systems.</p>
      </div>
      <div style="padding:28px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px">
        <img src="https://placehold.co/120x120/2a2f3e/e2e8f0?text=MJ" alt="Team" style="width:80px;height:80px;border-radius:50%;margin-bottom:16px" />
        <h3 style="font-size:16px;font-weight:700;color:#e2e8f0;margin:0 0 4px">Mike Johnson</h3>
        <p style="font-size:13px;color:#a855f7;margin:0 0 8px;font-weight:600">Head of Design</p>
        <p style="font-size:13px;color:#9ca3af;margin:0">Design systems expert creating beautiful experiences.</p>
      </div>
      <div style="padding:28px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px">
        <img src="https://placehold.co/120x120/2a2f3e/e2e8f0?text=EW" alt="Team" style="width:80px;height:80px;border-radius:50%;margin-bottom:16px" />
        <h3 style="font-size:16px;font-weight:700;color:#e2e8f0;margin:0 0 4px">Emily Williams</h3>
        <p style="font-size:13px;color:#ef4444;margin:0 0 8px;font-weight:600">VP Engineering</p>
        <p style="font-size:13px;color:#9ca3af;margin:0">Infrastructure wizard scaling to millions of requests.</p>
      </div>
    </div>
  </div>
</section>`,
);

// ═══════════════════════════════════════════════════════════════
// STATS SECTIONS
// ═══════════════════════════════════════════════════════════════

const statsCounter = sec(
  'stats-counters',
  'Stats Counter Cards',
  'stats',
  'Big number stats in a row with labels.',
  'linear-gradient(180deg, #1a1f2e 0%, #0f1219 100%)',
  `<section style="padding:60px 24px;background:#1a1f2e">
  <div style="max-width:1000px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px;text-align:center">
    <div><div style="font-size:48px;font-weight:900;color:#C9A94E;margin-bottom:4px">2,600+</div><div style="font-size:14px;color:#9ca3af;font-weight:500">AI Engines</div></div>
    <div><div style="font-size:48px;font-weight:900;color:#14b8a6;margin-bottom:4px">99.9%</div><div style="font-size:14px;color:#9ca3af;font-weight:500">Uptime</div></div>
    <div><div style="font-size:48px;font-weight:900;color:#a855f7;margin-bottom:4px">&lt;50ms</div><div style="font-size:14px;color:#9ca3af;font-weight:500">Response Time</div></div>
    <div><div style="font-size:48px;font-weight:900;color:#ef4444;margin-bottom:4px">10K+</div><div style="font-size:14px;color:#9ca3af;font-weight:500">Users Worldwide</div></div>
  </div>
</section>`,
);

// ═══════════════════════════════════════════════════════════════
// GALLERY SECTIONS
// ═══════════════════════════════════════════════════════════════

const galleryGrid = sec(
  'gallery-grid',
  'Image Gallery Grid',
  'gallery',
  'Responsive image gallery with consistent grid layout.',
  'linear-gradient(180deg, #0f1219 0%, #1a1f2e 100%)',
  `<section style="padding:80px 24px;background:#0f1219">
  <div style="max-width:1100px;margin:0 auto;text-align:center">
    <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:#e2e8f0;margin:0 0 48px">Our Work</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
      <img src="https://placehold.co/400x300/1a1f2e/C9A94E?text=Project+1" alt="Project" style="width:100%;border-radius:12px;display:block" />
      <img src="https://placehold.co/400x300/1a1f2e/14b8a6?text=Project+2" alt="Project" style="width:100%;border-radius:12px;display:block" />
      <img src="https://placehold.co/400x300/1a1f2e/a855f7?text=Project+3" alt="Project" style="width:100%;border-radius:12px;display:block" />
      <img src="https://placehold.co/400x300/1a1f2e/ef4444?text=Project+4" alt="Project" style="width:100%;border-radius:12px;display:block" />
      <img src="https://placehold.co/400x300/1a1f2e/22c55e?text=Project+5" alt="Project" style="width:100%;border-radius:12px;display:block" />
      <img src="https://placehold.co/400x300/1a1f2e/f59e0b?text=Project+6" alt="Project" style="width:100%;border-radius:12px;display:block" />
    </div>
  </div>
</section>`,
);

// ═══════════════════════════════════════════════════════════════
// BLOG SECTIONS
// ═══════════════════════════════════════════════════════════════

const blogCardGrid = sec(
  'blog-cards',
  'Blog Card Grid',
  'blog',
  'Grid of blog post preview cards with images.',
  'linear-gradient(180deg, #0f1219 0%, #1a1f2e 100%)',
  `<section style="padding:80px 24px;background:#0f1219">
  <div style="max-width:1100px;margin:0 auto">
    <div style="text-align:center;margin-bottom:48px">
      <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:#e2e8f0;margin:0 0 12px">Latest from the Blog</h2>
      <p style="font-size:16px;color:#9ca3af;margin:0">Insights, tutorials, and updates from our team.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px">
      <article style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;overflow:hidden">
        <img src="https://placehold.co/400x200/2a2f3e/C9A94E?text=Blog+Post" alt="Blog" style="width:100%;display:block" />
        <div style="padding:24px">
          <span style="font-size:12px;color:#C9A94E;font-weight:600">TUTORIAL</span>
          <h3 style="font-size:17px;font-weight:700;color:#e2e8f0;margin:8px 0">Building Your First AI Website</h3>
          <p style="font-size:14px;color:#9ca3af;margin:0 0 16px;line-height:1.5">Learn how to create a stunning website using our AI builder in under 10 minutes.</p>
          <a href="#" style="color:#C9A94E;text-decoration:none;font-size:14px;font-weight:600">Read More &rarr;</a>
        </div>
      </article>
      <article style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;overflow:hidden">
        <img src="https://placehold.co/400x200/2a2f3e/14b8a6?text=Blog+Post" alt="Blog" style="width:100%;display:block" />
        <div style="padding:24px">
          <span style="font-size:12px;color:#14b8a6;font-weight:600">DESIGN</span>
          <h3 style="font-size:17px;font-weight:700;color:#e2e8f0;margin:8px 0">Modern Web Design Trends 2026</h3>
          <p style="font-size:14px;color:#9ca3af;margin:0 0 16px;line-height:1.5">The biggest design trends shaping the web this year and beyond.</p>
          <a href="#" style="color:#14b8a6;text-decoration:none;font-size:14px;font-weight:600">Read More &rarr;</a>
        </div>
      </article>
      <article style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;overflow:hidden">
        <img src="https://placehold.co/400x200/2a2f3e/a855f7?text=Blog+Post" alt="Blog" style="width:100%;display:block" />
        <div style="padding:24px">
          <span style="font-size:12px;color:#a855f7;font-weight:600">PRODUCT</span>
          <h3 style="font-size:17px;font-weight:700;color:#e2e8f0;margin:8px 0">Introducing Smart Templates</h3>
          <p style="font-size:14px;color:#9ca3af;margin:0 0 16px;line-height:1.5">AI-powered templates that adapt to your content and brand automatically.</p>
          <a href="#" style="color:#a855f7;text-decoration:none;font-size:14px;font-weight:600">Read More &rarr;</a>
        </div>
      </article>
    </div>
  </div>
</section>`,
);

// ═══════════════════════════════════════════════════════════════
// LOGOS / PARTNERS
// ═══════════════════════════════════════════════════════════════

const logosBar = sec(
  'logos-bar',
  'Partner Logos Bar',
  'logos',
  'Horizontal row of partner/client logos.',
  'linear-gradient(90deg, #0f1219 0%, #1a1f2e 50%, #0f1219 100%)',
  `<section style="padding:48px 24px;background:#0f1219;border-top:1px solid #2a2f3e;border-bottom:1px solid #2a2f3e">
  <div style="max-width:1100px;margin:0 auto;text-align:center">
    <p style="font-size:13px;color:#9ca3af;margin:0 0 24px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600">Trusted by industry leaders</p>
    <div style="display:flex;align-items:center;justify-content:center;gap:48px;flex-wrap:wrap;opacity:0.5">
      <span style="font-size:22px;font-weight:800;color:#9ca3af">Acme Inc</span>
      <span style="font-size:22px;font-weight:800;color:#9ca3af">TechCorp</span>
      <span style="font-size:22px;font-weight:800;color:#9ca3af">DataFlow</span>
      <span style="font-size:22px;font-weight:800;color:#9ca3af">CloudBase</span>
      <span style="font-size:22px;font-weight:800;color:#9ca3af">ScaleUp</span>
    </div>
  </div>
</section>`,
);

// ═══════════════════════════════════════════════════════════════
// HOW IT WORKS
// ═══════════════════════════════════════════════════════════════

const howItWorksSteps = sec(
  'how-it-works-steps',
  'Numbered Steps',
  'how-it-works',
  '3-step process with numbered icons and descriptions.',
  'linear-gradient(180deg, #1a1f2e 0%, #0f1219 100%)',
  `<section style="padding:80px 24px;background:#0f1219">
  <div style="max-width:1000px;margin:0 auto;text-align:center">
    <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:#e2e8f0;margin:0 0 12px">How It Works</h2>
    <p style="font-size:16px;color:#9ca3af;margin:0 0 48px">Three simple steps to your new website.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:32px;position:relative">
      <div style="text-align:center">
        <div style="width:56px;height:56px;border-radius:50%;background:#C9A94E;color:#0f1219;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;margin:0 auto 20px">1</div>
        <h3 style="font-size:18px;font-weight:700;color:#e2e8f0;margin:0 0 8px">Describe</h3>
        <p style="font-size:14px;color:#9ca3af;margin:0;line-height:1.6">Tell our AI what kind of website you need in plain English.</p>
      </div>
      <div style="text-align:center">
        <div style="width:56px;height:56px;border-radius:50%;background:#14b8a6;color:#0f1219;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;margin:0 auto 20px">2</div>
        <h3 style="font-size:18px;font-weight:700;color:#e2e8f0;margin:0 0 8px">Customize</h3>
        <p style="font-size:14px;color:#9ca3af;margin:0;line-height:1.6">Fine-tune the design with our visual editor or ask AI for changes.</p>
      </div>
      <div style="text-align:center">
        <div style="width:56px;height:56px;border-radius:50%;background:#a855f7;color:#ffffff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;margin:0 auto 20px">3</div>
        <h3 style="font-size:18px;font-weight:700;color:#e2e8f0;margin:0 0 8px">Publish</h3>
        <p style="font-size:14px;color:#9ca3af;margin:0;line-height:1.6">One click to deploy globally with a custom domain and SSL.</p>
      </div>
    </div>
  </div>
</section>`,
);

// ═══════════════════════════════════════════════════════════════
// VIDEO SECTION
// ═══════════════════════════════════════════════════════════════

const videoEmbed = sec(
  'video-embed',
  'Video Embed Section',
  'video',
  'Full-width video section with title and embed placeholder.',
  'linear-gradient(180deg, #0f1219 0%, #1a1f2e 100%)',
  `<section style="padding:80px 24px;background:#0f1219;text-align:center">
  <div style="max-width:900px;margin:0 auto">
    <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:#e2e8f0;margin:0 0 12px">See It in Action</h2>
    <p style="font-size:16px;color:#9ca3af;margin:0 0 40px">Watch how easy it is to build a complete website in minutes.</p>
    <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:16px;overflow:hidden;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center">
      <div style="text-align:center">
        <div style="width:80px;height:80px;border-radius:50%;background:#C9A94E33;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;cursor:pointer"><span style="font-size:32px;color:#C9A94E;margin-left:4px">&#9654;</span></div>
        <p style="font-size:14px;color:#9ca3af;margin:0">Click to play video</p>
      </div>
    </div>
  </div>
</section>`,
);

// ═══════════════════════════════════════════════════════════════
// NEWSLETTER SECTION
// ═══════════════════════════════════════════════════════════════

const newsletterInline = sec(
  'newsletter-inline',
  'Inline Newsletter',
  'newsletter',
  'Email signup bar with input field and subscribe button.',
  'linear-gradient(135deg, #1a1f2e 0%, #0f1219 100%)',
  `<section style="padding:60px 24px;background:#1a1f2e;border-top:1px solid #2a2f3e;border-bottom:1px solid #2a2f3e">
  <div style="max-width:600px;margin:0 auto;text-align:center">
    <h2 style="font-size:24px;font-weight:800;color:#e2e8f0;margin:0 0 8px">Stay in the Loop</h2>
    <p style="font-size:14px;color:#9ca3af;margin:0 0 24px">Get the latest updates, tips, and product news delivered to your inbox.</p>
    <form style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
      <input type="email" placeholder="Enter your email" style="flex:1;min-width:240px;padding:12px 16px;background:#0f1219;border:1px solid #2a2f3e;border-radius:8px;color:#e2e8f0;font-size:14px;outline:none" />
      <button type="submit" style="padding:12px 24px;background:#C9A94E;color:#0f1219;border:none;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;white-space:nowrap">Subscribe</button>
    </form>
    <p style="font-size:12px;color:#9ca3af;margin:12px 0 0">No spam. Unsubscribe anytime.</p>
  </div>
</section>`,
);

// ═══════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════

export const SECTION_CATALOG: SectionDefinition[] = [
  // Hero (4)
  heroClassic,
  heroSplit,
  heroGradient,
  heroApp,
  // Navigation (2)
  navSimple,
  navMega,
  // Features (3)
  features3Col,
  featuresAlternating,
  featuresBento,
  // Pricing (1)
  pricing3Tier,
  // Testimonials (1)
  testimonialsGrid,
  // CTA (2)
  ctaCentered,
  ctaSplit,
  // Contact (2)
  contactForm,
  contactCards,
  // Footer (2)
  footerMultiCol,
  footerSimple,
  // FAQ (1)
  faqAccordion,
  // Team (1)
  teamGrid,
  // Stats (1)
  statsCounter,
  // Gallery (1)
  galleryGrid,
  // Blog (1)
  blogCardGrid,
  // Logos (1)
  logosBar,
  // How It Works (1)
  howItWorksSteps,
  // Video (1)
  videoEmbed,
  // Newsletter (1)
  newsletterInline,
];

export function getSectionsByCategory(category: SectionCategory): SectionDefinition[] {
  return SECTION_CATALOG.filter((s) => s.category === category);
}

export function getSectionById(id: string): SectionDefinition | undefined {
  return SECTION_CATALOG.find((s) => s.id === id);
}
