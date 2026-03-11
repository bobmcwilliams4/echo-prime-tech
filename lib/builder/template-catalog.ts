// Template Catalog — 12 complete website templates for the Website Builder
// Each template uses inline styles (no Tailwind) for iframe rendering
// Accent: #C9A94E | Font: Inter

import type { TemplateDefinition, TemplateCategory } from './types';

const ACCENT = '#C9A94E';
const BG = '#0f1219';
const SURFACE = '#1a1f2e';
const TEXT = '#e2e8f0';
const MUTED = '#9ca3af';
const BORDER = '#2a3040';
const BASE_STYLE = `<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',system-ui,sans-serif;background:${BG};color:${TEXT};line-height:1.6}a{color:${ACCENT};text-decoration:none}img{max-width:100%;display:block}.btn{display:inline-block;padding:12px 28px;background:${ACCENT};color:#000;font-weight:700;border-radius:8px;border:none;cursor:pointer;font-size:15px;letter-spacing:.3px}.btn-outline{background:transparent;border:2px solid ${ACCENT};color:${ACCENT}}.container{max-width:1100px;margin:0 auto;padding:0 24px}h1,h2,h3{font-weight:700;line-height:1.2}h1{font-size:42px}h2{font-size:30px}h3{font-size:20px}p{color:${MUTED}}</style>`;

/* ---------- 1. SaaS Landing ---------- */
const saasLandingHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLE}<style>
.nav{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid ${BORDER};background:${BG}}
.nav-brand{font-size:22px;font-weight:800;color:${ACCENT}}
.nav-links{display:flex;gap:28px}
.nav-links a{color:${MUTED};font-size:14px;font-weight:500}
.hero{text-align:center;padding:100px 24px 80px}
.hero h1{font-size:52px;margin-bottom:18px;background:linear-gradient(135deg,${TEXT},${ACCENT});-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{font-size:18px;max-width:600px;margin:0 auto 36px}
.hero-btns{display:flex;gap:14px;justify-content:center}
.features{padding:80px 24px;background:${SURFACE}}
.features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;max-width:1100px;margin:0 auto}
.feature-card{background:${BG};border:1px solid ${BORDER};border-radius:12px;padding:32px}
.feature-icon{width:48px;height:48px;border-radius:10px;background:rgba(201,169,78,.15);display:flex;align-items:center;justify-content:center;color:${ACCENT};font-size:24px;margin-bottom:16px}
.feature-card h3{margin-bottom:10px}
.pricing{padding:80px 24px;text-align:center}
.pricing h2{margin-bottom:12px}
.pricing>p{margin-bottom:48px}
.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;max-width:960px;margin:0 auto}
.price-card{background:${SURFACE};border:1px solid ${BORDER};border-radius:14px;padding:36px;text-align:left}
.price-card.popular{border-color:${ACCENT};box-shadow:0 0 30px rgba(201,169,78,.12)}
.price-label{font-size:13px;text-transform:uppercase;letter-spacing:1px;color:${MUTED};margin-bottom:8px}
.price-amount{font-size:40px;font-weight:800;color:${TEXT};margin-bottom:6px}
.price-amount span{font-size:16px;color:${MUTED};font-weight:400}
.price-features{list-style:none;margin:24px 0;display:flex;flex-direction:column;gap:12px}
.price-features li{color:${MUTED};font-size:14px}
.price-features li::before{content:'\\2713';color:${ACCENT};margin-right:8px;font-weight:700}
.cta-section{padding:80px 24px;text-align:center;background:linear-gradient(135deg,rgba(201,169,78,.08),transparent)}
.cta-section h2{margin-bottom:14px}
.cta-section p{margin-bottom:32px}
.footer{padding:40px 24px;border-top:1px solid ${BORDER};text-align:center;color:${MUTED};font-size:13px}
</style></head><body>
<nav class="nav"><div class="nav-brand">SaaSify</div><div class="nav-links"><a href="#">Features</a><a href="#">Pricing</a><a href="#">Docs</a><a href="#">Blog</a></div><a href="#" class="btn" style="padding:10px 22px;font-size:13px">Get Started</a></nav>
<section class="hero"><h1>Ship faster with AI-powered workflows</h1><p>Automate repetitive tasks, collaborate in real-time, and scale your product with intelligent tooling built for modern teams.</p><div class="hero-btns"><a href="#" class="btn">Start Free Trial</a><a href="#" class="btn btn-outline">Watch Demo</a></div></section>
<section class="features"><div class="container"><h2 style="text-align:center;margin-bottom:48px">Everything you need to scale</h2><div class="features-grid">
<div class="feature-card"><div class="feature-icon">&#9889;</div><h3>Lightning Fast</h3><p>Sub-50ms response times globally with edge deployment across 300+ locations.</p></div>
<div class="feature-card"><div class="feature-icon">&#128274;</div><h3>Enterprise Security</h3><p>SOC 2 compliant, end-to-end encryption, and role-based access controls baked in.</p></div>
<div class="feature-card"><div class="feature-icon">&#128200;</div><h3>Real-Time Analytics</h3><p>Track every metric that matters with customizable dashboards and automated reports.</p></div>
<div class="feature-card"><div class="feature-icon">&#129302;</div><h3>AI Automation</h3><p>Smart workflows that learn from your patterns and automate the tedious stuff.</p></div>
<div class="feature-card"><div class="feature-icon">&#128640;</div><h3>One-Click Deploy</h3><p>Push to production in seconds. Zero-downtime deploys with automatic rollback.</p></div>
<div class="feature-card"><div class="feature-icon">&#9881;</div><h3>API-First</h3><p>RESTful and GraphQL endpoints. Webhooks, SDKs in 8 languages, and full OpenAPI docs.</p></div>
</div></div></section>
<section class="pricing"><h2>Simple, transparent pricing</h2><p>No hidden fees. Cancel anytime.</p><div class="pricing-grid">
<div class="price-card"><div class="price-label">Starter</div><div class="price-amount">$29<span>/mo</span></div><p style="font-size:14px">For small teams getting started.</p><ul class="price-features"><li>5 team members</li><li>10,000 API calls/mo</li><li>Community support</li><li>Basic analytics</li></ul><a href="#" class="btn btn-outline" style="width:100%;text-align:center;display:block">Choose Starter</a></div>
<div class="price-card popular"><div class="price-label" style="color:${ACCENT}">Pro &#11088;</div><div class="price-amount">$79<span>/mo</span></div><p style="font-size:14px">For growing teams that need more.</p><ul class="price-features"><li>25 team members</li><li>100,000 API calls/mo</li><li>Priority support</li><li>Advanced analytics</li><li>Custom integrations</li></ul><a href="#" class="btn" style="width:100%;text-align:center;display:block">Choose Pro</a></div>
<div class="price-card"><div class="price-label">Enterprise</div><div class="price-amount">Custom</div><p style="font-size:14px">For organizations with complex needs.</p><ul class="price-features"><li>Unlimited members</li><li>Unlimited API calls</li><li>Dedicated support</li><li>SLA &amp; compliance</li><li>On-premise option</li></ul><a href="#" class="btn btn-outline" style="width:100%;text-align:center;display:block">Contact Sales</a></div>
</div></section>
<section class="cta-section"><h2>Ready to accelerate your workflow?</h2><p>Join 12,000+ teams already building with SaaSify. No credit card required.</p><a href="#" class="btn">Start Free Trial</a></section>
<footer class="footer">&copy; 2026 SaaSify. All rights reserved. <a href="#">Privacy</a> &middot; <a href="#">Terms</a></footer>
</body></html>`;

/* ---------- 2. Portfolio ---------- */
const portfolioHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLE}<style>
.pf-nav{display:flex;align-items:center;justify-content:space-between;padding:24px 40px}
.pf-nav-name{font-size:20px;font-weight:800;letter-spacing:-.5px}
.pf-nav-links{display:flex;gap:24px}
.pf-nav-links a{color:${MUTED};font-size:14px}
.pf-hero{padding:120px 40px 80px;max-width:800px}
.pf-hero h1{font-size:56px;margin-bottom:20px;line-height:1.1}
.pf-hero h1 span{color:${ACCENT}}
.pf-hero p{font-size:18px;max-width:560px;margin-bottom:32px}
.pf-work{padding:60px 40px}
.pf-work h2{margin-bottom:40px}
.pf-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
.pf-item{background:${SURFACE};border:1px solid ${BORDER};border-radius:12px;overflow:hidden}
.pf-item-img{height:220px;background:linear-gradient(135deg,#1a2030,#2a3050);display:flex;align-items:center;justify-content:center;font-size:48px}
.pf-item-info{padding:20px}
.pf-item-info h3{margin-bottom:6px}
.pf-item-info p{font-size:13px}
.pf-about{padding:80px 40px;display:flex;gap:60px;align-items:flex-start;max-width:1100px;margin:0 auto}
.pf-about-img{width:280px;height:320px;border-radius:16px;background:linear-gradient(135deg,${SURFACE},#2a3550);flex-shrink:0}
.pf-about-text h2{margin-bottom:16px}
.pf-about-text p{margin-bottom:14px;font-size:15px}
.pf-contact{padding:80px 40px;background:${SURFACE};text-align:center}
.pf-contact h2{margin-bottom:12px}
.pf-contact p{margin-bottom:32px}
.pf-footer{padding:32px 40px;text-align:center;font-size:13px;color:${MUTED}}
</style></head><body>
<nav class="pf-nav"><div class="pf-nav-name">Alex Rivera</div><div class="pf-nav-links"><a href="#">Work</a><a href="#">About</a><a href="#">Contact</a></div></nav>
<section class="pf-hero"><h1>I design digital experiences that <span>feel right</span></h1><p>Product designer with 8 years crafting interfaces for startups and Fortune 500s. Currently freelance, based in Brooklyn.</p><a href="#" class="btn">View Work</a></section>
<section class="pf-work"><h2>Selected Work</h2><div class="pf-grid">
<div class="pf-item"><div class="pf-item-img">&#127912;</div><div class="pf-item-info"><h3>Finova — Banking App</h3><p>Mobile banking redesign increasing engagement by 40%</p></div></div>
<div class="pf-item"><div class="pf-item-img">&#128187;</div><div class="pf-item-info"><h3>Archetype — SaaS Platform</h3><p>Design system and dashboard for enterprise analytics</p></div></div>
<div class="pf-item"><div class="pf-item-img">&#127756;</div><div class="pf-item-info"><h3>WanderMap — Travel</h3><p>End-to-end travel planning experience with AI itineraries</p></div></div>
<div class="pf-item"><div class="pf-item-img">&#127918;</div><div class="pf-item-info"><h3>PlayGrid — Gaming</h3><p>Social gaming platform connecting 2M+ players globally</p></div></div>
</div></section>
<section class="pf-about"><div class="pf-about-img"></div><div class="pf-about-text"><h2>About Me</h2><p>I am a product designer who believes great design is invisible. With a background in cognitive psychology and computer science, I bring a unique perspective to every project.</p><p>I have worked with companies like Stripe, Notion, and Vercel, helping them create products that millions of people use daily. My approach combines deep user research with systematic design thinking.</p><p style="color:${ACCENT};font-weight:600">Figma &middot; Framer &middot; React &middot; Swift &middot; TypeScript</p></div></section>
<section class="pf-contact"><h2>Let's work together</h2><p>I am currently accepting new projects for Q2 2026.</p><a href="#" class="btn">Get in Touch</a></section>
<footer class="pf-footer">&copy; 2026 Alex Rivera. Designed with care.</footer>
</body></html>`;

/* ---------- 3. E-Commerce Store ---------- */
const ecommerceHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLE}<style>
.ec-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 32px;border-bottom:1px solid ${BORDER}}
.ec-brand{font-size:22px;font-weight:800;color:${ACCENT};letter-spacing:2px;text-transform:uppercase}
.ec-nav-right{display:flex;align-items:center;gap:20px}
.ec-nav-right a{color:${MUTED};font-size:14px}
.ec-search{padding:8px 16px;background:${SURFACE};border:1px solid ${BORDER};border-radius:8px;color:${TEXT};font-size:13px;width:240px}
.ec-hero{display:flex;align-items:center;padding:60px 32px;gap:48px;max-width:1100px;margin:0 auto}
.ec-hero-text h1{font-size:44px;margin-bottom:14px}
.ec-hero-text p{margin-bottom:24px;font-size:16px}
.ec-hero-img{width:420px;height:320px;border-radius:16px;background:linear-gradient(135deg,#1a2540,#2a3860);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:64px}
.ec-featured{padding:60px 32px;background:${SURFACE}}
.ec-featured h2{text-align:center;margin-bottom:40px}
.ec-products{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;max-width:1100px;margin:0 auto}
.ec-prod{background:${BG};border:1px solid ${BORDER};border-radius:12px;overflow:hidden}
.ec-prod-img{height:200px;background:linear-gradient(135deg,#161c28,#222e44);display:flex;align-items:center;justify-content:center;font-size:40px}
.ec-prod-info{padding:16px}
.ec-prod-info h3{font-size:16px;margin-bottom:4px}
.ec-prod-price{color:${ACCENT};font-weight:700;font-size:18px;margin-bottom:10px}
.ec-prod-info .btn{font-size:12px;padding:8px 16px;width:100%;text-align:center;display:block}
.ec-categories{padding:60px 32px}
.ec-categories h2{text-align:center;margin-bottom:40px}
.ec-cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1100px;margin:0 auto}
.ec-cat{height:180px;border-radius:14px;display:flex;align-items:flex-end;padding:24px;font-weight:700;font-size:20px;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.7))}
.ec-footer{padding:40px 32px;border-top:1px solid ${BORDER};display:flex;justify-content:space-between;max-width:1100px;margin:0 auto}
.ec-footer-col h4{font-size:14px;color:${TEXT};margin-bottom:12px}
.ec-footer-col a{display:block;color:${MUTED};font-size:13px;margin-bottom:6px}
</style></head><body>
<nav class="ec-nav"><div class="ec-brand">Luxe</div><div class="ec-nav-right"><input class="ec-search" placeholder="Search products..."><a href="#">Collections</a><a href="#">New Arrivals</a><a href="#">Sale</a><a href="#" style="color:${ACCENT}">Cart (3)</a></div></nav>
<section class="ec-hero"><div class="ec-hero-text"><h1>New Season Collection</h1><p>Discover curated pieces for the modern lifestyle. Premium materials, timeless design, delivered to your door.</p><a href="#" class="btn">Shop Now</a></div><div class="ec-hero-img">&#128092;</div></section>
<section class="ec-featured"><h2>Featured Products</h2><div class="ec-products">
<div class="ec-prod"><div class="ec-prod-img">&#9201;</div><div class="ec-prod-info"><h3>Chrono Classic Watch</h3><div class="ec-prod-price">$249</div><a href="#" class="btn">Add to Cart</a></div></div>
<div class="ec-prod"><div class="ec-prod-img">&#128091;</div><div class="ec-prod-info"><h3>Leather Weekend Bag</h3><div class="ec-prod-price">$189</div><a href="#" class="btn">Add to Cart</a></div></div>
<div class="ec-prod"><div class="ec-prod-img">&#128083;</div><div class="ec-prod-info"><h3>Titanium Sunglasses</h3><div class="ec-prod-price">$129</div><a href="#" class="btn">Add to Cart</a></div></div>
<div class="ec-prod"><div class="ec-prod-img">&#128094;</div><div class="ec-prod-info"><h3>Merino Wool Scarf</h3><div class="ec-prod-price">$79</div><a href="#" class="btn">Add to Cart</a></div></div>
</div></section>
<section class="ec-categories"><h2>Shop by Category</h2><div class="ec-cat-grid">
<div class="ec-cat" style="background:linear-gradient(135deg,#2a1a30,#1a2a40)">Accessories</div>
<div class="ec-cat" style="background:linear-gradient(135deg,#1a2a20,#2a3a30)">Outerwear</div>
<div class="ec-cat" style="background:linear-gradient(135deg,#2a2a1a,#3a3020)">Footwear</div>
</div></section>
<footer><div class="ec-footer">
<div class="ec-footer-col"><h4>Shop</h4><a href="#">All Products</a><a href="#">New Arrivals</a><a href="#">Best Sellers</a><a href="#">Sale</a></div>
<div class="ec-footer-col"><h4>Help</h4><a href="#">Shipping &amp; Returns</a><a href="#">FAQ</a><a href="#">Size Guide</a></div>
<div class="ec-footer-col"><h4>Company</h4><a href="#">About Us</a><a href="#">Sustainability</a><a href="#">Careers</a></div>
<div class="ec-footer-col"><h4>Connect</h4><a href="#">Instagram</a><a href="#">Twitter</a><a href="#">Newsletter</a></div>
</div><div style="text-align:center;padding:24px;color:${MUTED};font-size:12px;border-top:1px solid ${BORDER}">&copy; 2026 Luxe. All rights reserved.</div></footer>
</body></html>`;

/* ---------- 4. Restaurant ---------- */
const restaurantHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLE}<style>
.rst-nav{display:flex;align-items:center;justify-content:space-between;padding:20px 40px}
.rst-logo{font-size:28px;font-weight:800;font-style:italic;color:${ACCENT}}
.rst-nav-links{display:flex;gap:28px}
.rst-nav-links a{color:${MUTED};font-size:14px;text-transform:uppercase;letter-spacing:1px}
.rst-hero{text-align:center;padding:120px 24px;background:linear-gradient(180deg,rgba(201,169,78,.06),transparent)}
.rst-hero h1{font-size:56px;font-style:italic;margin-bottom:16px}
.rst-hero p{font-size:18px;max-width:500px;margin:0 auto 36px}
.rst-ambiance{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;max-width:1100px;margin:0 auto;padding:0 24px}
.rst-amb-item{height:260px;border-radius:8px;display:flex;align-items:flex-end;padding:20px}
.rst-menu{padding:80px 24px}
.rst-menu h2{text-align:center;margin-bottom:12px}
.rst-menu>p{text-align:center;margin-bottom:48px}
.rst-menu-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;max-width:900px;margin:0 auto}
.rst-menu-item{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;border-bottom:1px solid ${BORDER};margin-bottom:16px}
.rst-dish-name{font-weight:600;color:${TEXT};font-size:16px}
.rst-dish-desc{font-size:13px;color:${MUTED};margin-top:4px}
.rst-dish-price{color:${ACCENT};font-weight:700;font-size:18px;white-space:nowrap;margin-left:16px}
.rst-reserve{padding:80px 24px;background:${SURFACE};text-align:center}
.rst-reserve h2{margin-bottom:12px}
.rst-reserve p{margin-bottom:32px}
.rst-reserve-form{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.rst-reserve-form input,.rst-reserve-form select{padding:12px 16px;background:${BG};border:1px solid ${BORDER};border-radius:8px;color:${TEXT};font-size:14px}
.rst-footer{padding:40px 24px;text-align:center;color:${MUTED};font-size:13px}
</style></head><body>
<nav class="rst-nav"><div class="rst-logo">La Maison</div><div class="rst-nav-links"><a href="#">Menu</a><a href="#">Reserve</a><a href="#">About</a><a href="#">Contact</a></div></nav>
<section class="rst-hero"><h1>Fine Dining,<br>Redefined</h1><p>Experience seasonal French-American cuisine crafted from locally sourced ingredients in an intimate, candlelit setting.</p><div style="display:flex;gap:14px;justify-content:center"><a href="#" class="btn">Reserve a Table</a><a href="#" class="btn btn-outline">View Menu</a></div></section>
<div class="rst-ambiance">
<div class="rst-amb-item" style="background:linear-gradient(180deg,transparent,rgba(0,0,0,.6)),linear-gradient(135deg,#2a1a10,#1a1520)"></div>
<div class="rst-amb-item" style="background:linear-gradient(180deg,transparent,rgba(0,0,0,.6)),linear-gradient(135deg,#1a2010,#101a20)"></div>
<div class="rst-amb-item" style="background:linear-gradient(180deg,transparent,rgba(0,0,0,.6)),linear-gradient(135deg,#201a20,#1a1020)"></div>
</div>
<section class="rst-menu"><h2>Our Menu</h2><p>Seasonal selections prepared by Chef Antoine Laurent</p><div class="rst-menu-grid"><div>
<h3 style="color:${ACCENT};margin-bottom:20px;font-size:14px;text-transform:uppercase;letter-spacing:2px">Starters</h3>
<div class="rst-menu-item"><div><div class="rst-dish-name">Seared Foie Gras</div><div class="rst-dish-desc">Fig compote, brioche, aged balsamic</div></div><div class="rst-dish-price">$32</div></div>
<div class="rst-menu-item"><div><div class="rst-dish-name">Burrata Caprese</div><div class="rst-dish-desc">Heirloom tomato, basil oil, prosciutto</div></div><div class="rst-dish-price">$24</div></div>
<div class="rst-menu-item"><div><div class="rst-dish-name">French Onion Soup</div><div class="rst-dish-desc">Gruyere crouton, caramelized shallots</div></div><div class="rst-dish-price">$18</div></div>
</div><div>
<h3 style="color:${ACCENT};margin-bottom:20px;font-size:14px;text-transform:uppercase;letter-spacing:2px">Mains</h3>
<div class="rst-menu-item"><div><div class="rst-dish-name">Wagyu Filet Mignon</div><div class="rst-dish-desc">Truffle jus, potato fondant, haricots verts</div></div><div class="rst-dish-price">$68</div></div>
<div class="rst-menu-item"><div><div class="rst-dish-name">Pan-Roasted Halibut</div><div class="rst-dish-desc">Saffron risotto, beurre blanc, fennel</div></div><div class="rst-dish-price">$48</div></div>
<div class="rst-menu-item"><div><div class="rst-dish-name">Duck Confit</div><div class="rst-dish-desc">Cherry gastrique, roasted root vegetables</div></div><div class="rst-dish-price">$42</div></div>
</div></div></section>
<section class="rst-reserve"><h2>Make a Reservation</h2><p>Book your table for an unforgettable evening.</p><form class="rst-reserve-form"><input type="date" placeholder="Date"><select><option>2 Guests</option><option>4 Guests</option><option>6 Guests</option><option>8 Guests</option></select><input type="time" value="19:00"><button type="button" class="btn">Reserve Now</button></form></section>
<footer class="rst-footer"><p>123 Boulevard Saint-Germain, New York, NY 10012</p><p style="margin-top:8px">&copy; 2026 La Maison. Open Tuesday - Sunday, 5:30 PM - 11 PM</p></footer>
</body></html>`;

/* ---------- 5. Blog / Magazine ---------- */
const blogMagazineHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLE}<style>
.bl-nav{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid ${BORDER}}
.bl-logo{font-size:24px;font-weight:800;letter-spacing:-1px}
.bl-nav-links{display:flex;gap:24px}
.bl-nav-links a{color:${MUTED};font-size:14px}
.bl-featured{padding:60px 32px;max-width:1100px;margin:0 auto;display:flex;gap:32px}
.bl-feat-img{flex:1;height:380px;border-radius:14px;background:linear-gradient(135deg,#1a2540,#2a3860);display:flex;align-items:center;justify-content:center;font-size:64px}
.bl-feat-text{flex:1;display:flex;flex-direction:column;justify-content:center}
.bl-feat-tag{color:${ACCENT};font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:12px}
.bl-feat-text h1{font-size:36px;margin-bottom:14px}
.bl-feat-text p{margin-bottom:20px;font-size:15px}
.bl-feat-meta{font-size:13px;color:${MUTED}}
.bl-main{padding:40px 32px;max-width:1100px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr;gap:40px}
.bl-articles{display:flex;flex-direction:column;gap:24px}
.bl-article{display:flex;gap:20px;padding-bottom:24px;border-bottom:1px solid ${BORDER}}
.bl-art-img{width:200px;height:140px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:32px}
.bl-art-text h3{font-size:18px;margin-bottom:8px;color:${TEXT}}
.bl-art-text p{font-size:13px;margin-bottom:8px}
.bl-art-meta{font-size:12px;color:${MUTED}}
.bl-sidebar h3{font-size:16px;color:${TEXT};margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid ${BORDER}}
.bl-sidebar-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:32px}
.bl-tag{padding:6px 14px;background:${SURFACE};border:1px solid ${BORDER};border-radius:20px;font-size:12px;color:${MUTED}}
.bl-sidebar-post{display:flex;gap:12px;margin-bottom:16px}
.bl-sidebar-post-img{width:60px;height:60px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:20px;background:${SURFACE}}
.bl-sidebar-post h4{font-size:14px;color:${TEXT};margin-bottom:4px}
.bl-sidebar-post p{font-size:11px;color:${MUTED}}
.bl-footer{padding:40px 32px;border-top:1px solid ${BORDER};text-align:center;font-size:13px;color:${MUTED}}
</style></head><body>
<nav class="bl-nav"><div class="bl-logo">The Pulse</div><div class="bl-nav-links"><a href="#">Technology</a><a href="#">Design</a><a href="#">Business</a><a href="#">Science</a><a href="#">Culture</a></div></nav>
<section class="bl-featured"><div class="bl-feat-img">&#128240;</div><div class="bl-feat-text"><div class="bl-feat-tag">Featured</div><h1>The Rise of Autonomous AI Agents in Enterprise</h1><p>How companies are deploying self-operating AI systems that handle complex workflows from end to end, reducing costs by 60% while improving accuracy.</p><div class="bl-feat-meta">By Sarah Chen &middot; March 5, 2026 &middot; 8 min read</div></div></section>
<div class="bl-main"><div class="bl-articles">
<div class="bl-article"><div class="bl-art-img" style="background:linear-gradient(135deg,#1a2030,#202840)">&#128187;</div><div class="bl-art-text"><h3>Edge Computing Is Eating the Cloud</h3><p>Why latency-sensitive applications are migrating from centralized data centers to distributed edge nodes.</p><div class="bl-art-meta">Mike Torres &middot; Mar 4, 2026 &middot; 6 min</div></div></div>
<div class="bl-article"><div class="bl-art-img" style="background:linear-gradient(135deg,#201a20,#2a2030)">&#127912;</div><div class="bl-art-text"><h3>Design Systems That Scale: Lessons from Figma</h3><p>Building component libraries that work across 50 designers and 200 engineers without breaking.</p><div class="bl-art-meta">Lena Park &middot; Mar 3, 2026 &middot; 5 min</div></div></div>
<div class="bl-article"><div class="bl-art-img" style="background:linear-gradient(135deg,#1a2020,#203030)">&#128300;</div><div class="bl-art-text"><h3>CRISPR 3.0: Gene Editing Goes Mainstream</h3><p>The third generation of gene editing tools promises safer, more precise modifications with clinical applications.</p><div class="bl-art-meta">Dr. James Liu &middot; Mar 2, 2026 &middot; 10 min</div></div></div>
<div class="bl-article"><div class="bl-art-img" style="background:linear-gradient(135deg,#202010,#303020)">&#128176;</div><div class="bl-art-text"><h3>Tokenized Real Estate: The $300T Opportunity</h3><p>How blockchain fractional ownership is democratizing commercial real estate investment.</p><div class="bl-art-meta">Rachel Kim &middot; Mar 1, 2026 &middot; 7 min</div></div></div>
</div><aside class="bl-sidebar"><h3>Popular Tags</h3><div class="bl-sidebar-tags"><span class="bl-tag">AI</span><span class="bl-tag">Cloud</span><span class="bl-tag">Design</span><span class="bl-tag">Crypto</span><span class="bl-tag">Startups</span><span class="bl-tag">Security</span><span class="bl-tag">HealthTech</span></div><h3>Trending</h3>
<div class="bl-sidebar-post"><div class="bl-sidebar-post-img">&#9889;</div><div><h4>Rust Is Replacing C++ Everywhere</h4><p>Feb 28 &middot; 4 min</p></div></div>
<div class="bl-sidebar-post"><div class="bl-sidebar-post-img">&#128640;</div><div><h4>SpaceX Starship Gen3 First Flight</h4><p>Feb 27 &middot; 3 min</p></div></div>
<div class="bl-sidebar-post"><div class="bl-sidebar-post-img">&#129302;</div><div><h4>GPT-5 Benchmark Results Leaked</h4><p>Feb 26 &middot; 5 min</p></div></div>
</aside></div>
<footer class="bl-footer">&copy; 2026 The Pulse. Independent technology journalism.</footer>
</body></html>`;

/* ---------- 6. Agency ---------- */
const agencyHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLE}<style>
.ag-nav{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid ${BORDER}}
.ag-brand{font-size:20px;font-weight:800}
.ag-nav-links{display:flex;gap:24px;align-items:center}
.ag-nav-links a{color:${MUTED};font-size:14px}
.ag-hero{padding:100px 32px 80px;text-align:center}
.ag-hero h1{font-size:50px;margin-bottom:18px;max-width:700px;margin-left:auto;margin-right:auto}
.ag-hero p{font-size:18px;max-width:560px;margin:0 auto 36px}
.ag-services{padding:80px 32px;background:${SURFACE}}
.ag-services h2{text-align:center;margin-bottom:48px}
.ag-srv-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;max-width:1100px;margin:0 auto}
.ag-srv{background:${BG};border:1px solid ${BORDER};border-radius:12px;padding:32px}
.ag-srv-num{font-size:40px;font-weight:800;color:rgba(201,169,78,.2);margin-bottom:12px}
.ag-srv h3{margin-bottom:10px}
.ag-cases{padding:80px 32px}
.ag-cases h2{text-align:center;margin-bottom:48px}
.ag-case-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;max-width:1100px;margin:0 auto}
.ag-case{border-radius:14px;overflow:hidden;border:1px solid ${BORDER}}
.ag-case-img{height:240px;display:flex;align-items:center;justify-content:center;font-size:48px}
.ag-case-info{padding:24px}
.ag-case-info h3{margin-bottom:8px}
.ag-case-tag{display:inline-block;padding:4px 12px;background:rgba(201,169,78,.1);color:${ACCENT};border-radius:20px;font-size:12px;font-weight:600;margin-bottom:12px}
.ag-team{padding:80px 32px;background:${SURFACE}}
.ag-team h2{text-align:center;margin-bottom:48px}
.ag-team-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;max-width:1000px;margin:0 auto;text-align:center}
.ag-member-img{width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,${BG},#2a3050);margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:28px}
.ag-member h3{font-size:16px;margin-bottom:4px}
.ag-member p{font-size:13px}
.ag-cta{padding:80px 32px;text-align:center}
.ag-cta h2{margin-bottom:14px}
.ag-cta p{margin-bottom:32px}
.ag-footer{padding:40px 32px;border-top:1px solid ${BORDER};text-align:center;font-size:13px;color:${MUTED}}
</style></head><body>
<nav class="ag-nav"><div class="ag-brand">Apex Creative</div><div class="ag-nav-links"><a href="#">Services</a><a href="#">Work</a><a href="#">Team</a><a href="#">Contact</a><a href="#" class="btn" style="padding:10px 22px;font-size:13px">Start a Project</a></div></nav>
<section class="ag-hero"><h1>We build brands that <span style="color:${ACCENT}">dominate</span></h1><p>Full-service digital agency specializing in brand strategy, product design, and growth marketing for ambitious companies.</p><a href="#" class="btn">See Our Work</a></section>
<section class="ag-services"><h2>Our Services</h2><div class="ag-srv-grid">
<div class="ag-srv"><div class="ag-srv-num">01</div><h3>Brand Strategy</h3><p>Positioning, messaging, and visual identity that resonates with your target audience and stands out from noise.</p></div>
<div class="ag-srv"><div class="ag-srv-num">02</div><h3>Product Design</h3><p>User research, prototyping, and pixel-perfect interfaces that convert visitors into loyal customers.</p></div>
<div class="ag-srv"><div class="ag-srv-num">03</div><h3>Growth Marketing</h3><p>Data-driven campaigns across paid, organic, and social channels that scale predictably.</p></div>
</div></section>
<section class="ag-cases"><h2>Case Studies</h2><div class="ag-case-grid">
<div class="ag-case"><div class="ag-case-img" style="background:linear-gradient(135deg,#1a2540,#2a3860)">&#128200;</div><div class="ag-case-info"><div class="ag-case-tag">FinTech</div><h3>NovaPay: 3x Conversion Rate</h3><p>Complete rebrand and app redesign that tripled their monthly signups within 90 days.</p></div></div>
<div class="ag-case"><div class="ag-case-img" style="background:linear-gradient(135deg,#201a2a,#302840)">&#128736;</div><div class="ag-case-info"><div class="ag-case-tag">SaaS</div><h3>BuildKit: $2M ARR in Year 1</h3><p>Product design and go-to-market strategy that launched a construction SaaS from zero to $2M ARR.</p></div></div>
</div></section>
<section class="ag-team"><h2>The Team</h2><div class="ag-team-grid">
<div class="ag-member"><div class="ag-member-img">&#128100;</div><h3>Jordan Blake</h3><p>Founder &amp; Strategy</p></div>
<div class="ag-member"><div class="ag-member-img">&#128100;</div><h3>Mia Chen</h3><p>Creative Director</p></div>
<div class="ag-member"><div class="ag-member-img">&#128100;</div><h3>David Osei</h3><p>Lead Developer</p></div>
<div class="ag-member"><div class="ag-member-img">&#128100;</div><h3>Emma Russo</h3><p>Growth Lead</p></div>
</div></section>
<section class="ag-cta"><h2>Ready to level up your brand?</h2><p>Let's talk about how we can help you grow. Free 30-minute strategy session.</p><a href="#" class="btn">Book a Call</a></section>
<footer class="ag-footer">&copy; 2026 Apex Creative. New York &middot; London &middot; Sydney</footer>
</body></html>`;

/* ---------- 7. Real Estate ---------- */
const realEstateHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLE}<style>
.re-nav{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid ${BORDER}}
.re-brand{font-size:20px;font-weight:800}
.re-hero{padding:100px 32px 80px;text-align:center;background:linear-gradient(180deg,rgba(201,169,78,.05),transparent)}
.re-hero h1{font-size:48px;margin-bottom:16px}
.re-hero p{font-size:17px;max-width:520px;margin:0 auto 36px}
.re-search{display:flex;gap:10px;max-width:700px;margin:0 auto;background:${SURFACE};padding:12px;border-radius:12px;border:1px solid ${BORDER}}
.re-search input,.re-search select{flex:1;padding:12px 16px;background:${BG};border:1px solid ${BORDER};border-radius:8px;color:${TEXT};font-size:14px}
.re-search .btn{white-space:nowrap}
.re-listings{padding:60px 32px}
.re-listings h2{margin-bottom:36px}
.re-list-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1100px;margin:0 auto}
.re-card{border:1px solid ${BORDER};border-radius:12px;overflow:hidden;background:${SURFACE}}
.re-card-img{height:200px;display:flex;align-items:center;justify-content:center;font-size:40px;position:relative}
.re-card-badge{position:absolute;top:12px;left:12px;background:${ACCENT};color:#000;font-size:11px;font-weight:700;padding:4px 10px;border-radius:6px}
.re-card-info{padding:20px}
.re-card-price{font-size:24px;font-weight:800;color:${ACCENT};margin-bottom:4px}
.re-card-addr{font-size:14px;color:${MUTED};margin-bottom:12px}
.re-card-details{display:flex;gap:16px;font-size:13px;color:${MUTED}}
.re-agents{padding:80px 32px;background:${SURFACE}}
.re-agents h2{text-align:center;margin-bottom:40px}
.re-agent-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:900px;margin:0 auto;text-align:center}
.re-agent-img{width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,${BG},#2a3050);margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:28px}
.re-agent h3{font-size:16px;margin-bottom:2px}
.re-agent p{font-size:13px}
.re-stats{padding:60px 32px;display:flex;justify-content:center;gap:60px;text-align:center}
.re-stat-num{font-size:40px;font-weight:800;color:${ACCENT}}
.re-stat-label{font-size:14px;color:${MUTED};margin-top:4px}
.re-footer{padding:40px 32px;border-top:1px solid ${BORDER};text-align:center;font-size:13px;color:${MUTED}}
</style></head><body>
<nav class="re-nav"><div class="re-brand">PrimeRealty</div><div style="display:flex;gap:24px;align-items:center"><a href="#" style="color:${MUTED};font-size:14px">Buy</a><a href="#" style="color:${MUTED};font-size:14px">Sell</a><a href="#" style="color:${MUTED};font-size:14px">Rent</a><a href="#" style="color:${MUTED};font-size:14px">Agents</a><a href="#" class="btn" style="padding:10px 22px;font-size:13px">List Property</a></div></nav>
<section class="re-hero"><h1>Find Your Dream Home</h1><p>Browse thousands of premium listings across the nation with expert guidance every step of the way.</p><div class="re-search"><input placeholder="City, ZIP, or address"><select><option>Buy</option><option>Rent</option></select><select><option>Any Price</option><option>Under $500K</option><option>$500K - $1M</option><option>$1M+</option></select><button class="btn">Search</button></div></section>
<section class="re-listings"><h2 style="text-align:center">Featured Listings</h2><div class="re-list-grid">
<div class="re-card"><div class="re-card-img" style="background:linear-gradient(135deg,#1a2540,#2a3860)"><span class="re-card-badge">New</span>&#127968;</div><div class="re-card-info"><div class="re-card-price">$1,250,000</div><div class="re-card-addr">4521 Oak Ridge Dr, Austin, TX 78746</div><div class="re-card-details"><span>4 Beds</span><span>3 Baths</span><span>3,200 sqft</span></div></div></div>
<div class="re-card"><div class="re-card-img" style="background:linear-gradient(135deg,#201a2a,#302840)"><span class="re-card-badge">Open House</span>&#127960;</div><div class="re-card-info"><div class="re-card-price">$875,000</div><div class="re-card-addr">1200 Elm St #14B, Denver, CO 80220</div><div class="re-card-details"><span>3 Beds</span><span>2 Baths</span><span>1,800 sqft</span></div></div></div>
<div class="re-card"><div class="re-card-img" style="background:linear-gradient(135deg,#1a2020,#203030)"><span class="re-card-badge">Reduced</span>&#127961;</div><div class="re-card-info"><div class="re-card-price">$2,400,000</div><div class="re-card-addr">88 Ocean Blvd, Miami Beach, FL 33139</div><div class="re-card-details"><span>5 Beds</span><span>4 Baths</span><span>4,500 sqft</span></div></div></div>
</div></section>
<div class="re-stats"><div><div class="re-stat-num">12,400+</div><div class="re-stat-label">Active Listings</div></div><div><div class="re-stat-num">98%</div><div class="re-stat-label">Client Satisfaction</div></div><div><div class="re-stat-num">$2.8B</div><div class="re-stat-label">Total Sales Volume</div></div><div><div class="re-stat-num">340+</div><div class="re-stat-label">Expert Agents</div></div></div>
<section class="re-agents"><h2>Our Top Agents</h2><div class="re-agent-grid">
<div class="re-agent"><div class="re-agent-img">&#128100;</div><h3>Jennifer Walsh</h3><p>Austin, TX &middot; 15 years</p><p style="color:${ACCENT};font-size:12px;margin-top:4px">$180M in sales</p></div>
<div class="re-agent"><div class="re-agent-img">&#128100;</div><h3>Marcus Thompson</h3><p>Denver, CO &middot; 12 years</p><p style="color:${ACCENT};font-size:12px;margin-top:4px">$145M in sales</p></div>
<div class="re-agent"><div class="re-agent-img">&#128100;</div><h3>Priya Sharma</h3><p>Miami, FL &middot; 10 years</p><p style="color:${ACCENT};font-size:12px;margin-top:4px">$210M in sales</p></div>
</div></section>
<footer class="re-footer">&copy; 2026 PrimeRealty. Licensed in all 50 states. <a href="#">Privacy</a> &middot; <a href="#">Terms</a></footer>
</body></html>`;

/* ---------- 8. Medical Clinic ---------- */
const medicalClinicHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLE}<style>
.md-nav{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid ${BORDER}}
.md-brand{font-size:20px;font-weight:800;display:flex;align-items:center;gap:8px}
.md-brand span{color:${ACCENT}}
.md-hero{padding:100px 32px 80px;display:flex;gap:48px;align-items:center;max-width:1100px;margin:0 auto}
.md-hero-text{flex:1}
.md-hero-text h1{font-size:44px;margin-bottom:16px}
.md-hero-text p{font-size:16px;margin-bottom:28px}
.md-hero-img{width:400px;height:320px;border-radius:16px;background:linear-gradient(135deg,#0a1a2a,#152540);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:64px}
.md-services{padding:80px 32px;background:${SURFACE}}
.md-services h2{text-align:center;margin-bottom:48px}
.md-srv-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;max-width:1100px;margin:0 auto}
.md-srv{background:${BG};border:1px solid ${BORDER};border-radius:12px;padding:28px;text-align:center}
.md-srv-icon{font-size:36px;margin-bottom:12px}
.md-srv h3{font-size:16px;margin-bottom:8px}
.md-srv p{font-size:13px}
.md-doctors{padding:80px 32px}
.md-doctors h2{text-align:center;margin-bottom:48px}
.md-doc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;max-width:900px;margin:0 auto}
.md-doc{text-align:center;background:${SURFACE};border:1px solid ${BORDER};border-radius:14px;padding:32px}
.md-doc-img{width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,${BG},#1a2a40);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:32px}
.md-doc h3{font-size:18px;margin-bottom:4px}
.md-doc-spec{color:${ACCENT};font-size:13px;font-weight:600;margin-bottom:8px}
.md-doc p{font-size:13px}
.md-appt{padding:80px 32px;background:linear-gradient(135deg,rgba(201,169,78,.06),transparent);text-align:center}
.md-appt h2{margin-bottom:12px}
.md-appt>p{margin-bottom:32px}
.md-appt-form{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;max-width:700px;margin:0 auto}
.md-appt-form input,.md-appt-form select{padding:12px 16px;background:${SURFACE};border:1px solid ${BORDER};border-radius:8px;color:${TEXT};font-size:14px;min-width:160px}
.md-trust{padding:60px 32px;display:flex;justify-content:center;gap:60px;text-align:center}
.md-trust-num{font-size:36px;font-weight:800;color:${ACCENT}}
.md-trust-label{font-size:13px;color:${MUTED};margin-top:4px}
.md-footer{padding:40px 32px;border-top:1px solid ${BORDER};text-align:center;font-size:13px;color:${MUTED}}
</style></head><body>
<nav class="md-nav"><div class="md-brand"><span>&#9764;</span> Meridian Health</div><div style="display:flex;gap:24px;align-items:center"><a href="#" style="color:${MUTED};font-size:14px">Services</a><a href="#" style="color:${MUTED};font-size:14px">Doctors</a><a href="#" style="color:${MUTED};font-size:14px">Insurance</a><a href="#" style="color:${MUTED};font-size:14px">Contact</a><a href="#" class="btn" style="padding:10px 22px;font-size:13px">Book Appointment</a></div></nav>
<section class="md-hero"><div class="md-hero-text"><h1>Expert Care, Compassionate Touch</h1><p>Meridian Health provides comprehensive medical services with board-certified physicians committed to your wellbeing. Same-day appointments available.</p><div style="display:flex;gap:14px"><a href="#" class="btn">Book Now</a><a href="#" class="btn btn-outline">Our Services</a></div></div><div class="md-hero-img">&#9764;</div></section>
<section class="md-services"><h2>Our Specialties</h2><div class="md-srv-grid">
<div class="md-srv"><div class="md-srv-icon">&#128150;</div><h3>Cardiology</h3><p>Heart health screening, EKG, stress tests, and preventive care.</p></div>
<div class="md-srv"><div class="md-srv-icon">&#129504;</div><h3>Neurology</h3><p>Comprehensive neurological evaluation and treatment plans.</p></div>
<div class="md-srv"><div class="md-srv-icon">&#129516;</div><h3>Orthopedics</h3><p>Joint replacement, sports medicine, and physical therapy.</p></div>
<div class="md-srv"><div class="md-srv-icon">&#128065;</div><h3>Ophthalmology</h3><p>LASIK, cataract surgery, and routine eye exams.</p></div>
</div></section>
<section class="md-doctors"><h2>Meet Our Physicians</h2><div class="md-doc-grid">
<div class="md-doc"><div class="md-doc-img">&#128104;&#8205;&#9877;</div><h3>Dr. Robert Langley</h3><div class="md-doc-spec">Cardiology</div><p>Johns Hopkins trained. 20 years experience. Specializes in interventional cardiology.</p></div>
<div class="md-doc"><div class="md-doc-img">&#128105;&#8205;&#9877;</div><h3>Dr. Amara Okafor</h3><div class="md-doc-spec">Neurology</div><p>Stanford fellowship. Expert in movement disorders and neurodegenerative disease.</p></div>
<div class="md-doc"><div class="md-doc-img">&#128104;&#8205;&#9877;</div><h3>Dr. Kevin Park</h3><div class="md-doc-spec">Orthopedics</div><p>Former team physician for the Dallas Cowboys. Minimally invasive joint specialist.</p></div>
</div></section>
<section class="md-appt"><h2>Schedule Your Visit</h2><p>Same-day appointments available. Most insurance plans accepted.</p><form class="md-appt-form"><input placeholder="Full Name"><input type="tel" placeholder="Phone Number"><select><option>Select Specialty</option><option>Cardiology</option><option>Neurology</option><option>Orthopedics</option><option>Ophthalmology</option></select><input type="date"><button type="button" class="btn">Request Appointment</button></form></section>
<div class="md-trust"><div><div class="md-trust-num">45,000+</div><div class="md-trust-label">Patients Treated</div></div><div><div class="md-trust-num">4.9/5</div><div class="md-trust-label">Patient Rating</div></div><div><div class="md-trust-num">25+</div><div class="md-trust-label">Board-Certified MDs</div></div><div><div class="md-trust-num">12</div><div class="md-trust-label">Locations</div></div></div>
<footer class="md-footer"><p>Meridian Health &middot; 500 Medical Center Dr, Suite 200, Dallas, TX 75201</p><p style="margin-top:6px">&copy; 2026 Meridian Health. <a href="#">HIPAA Notice</a> &middot; <a href="#">Patient Rights</a></p></footer>
</body></html>`;

/* ---------- 9. Dashboard App ---------- */
const dashboardAppHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLE}<style>
.db-layout{display:flex;min-height:100vh}
.db-sidebar{width:240px;background:${SURFACE};border-right:1px solid ${BORDER};padding:20px 0;display:flex;flex-direction:column}
.db-sidebar-brand{font-size:18px;font-weight:800;padding:0 20px;margin-bottom:28px;display:flex;align-items:center;gap:8px}
.db-sidebar-brand span{color:${ACCENT}}
.db-sidebar-section{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${MUTED};padding:0 20px;margin:16px 0 8px}
.db-sidebar a{display:flex;align-items:center;gap:10px;padding:10px 20px;color:${MUTED};font-size:14px}
.db-sidebar a.active{color:${TEXT};background:rgba(201,169,78,.08);border-right:3px solid ${ACCENT}}
.db-sidebar a:hover{color:${TEXT};background:rgba(255,255,255,.03)}
.db-main{flex:1;padding:28px 32px;overflow-y:auto}
.db-topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px}
.db-topbar h1{font-size:24px}
.db-topbar-right{display:flex;align-items:center;gap:16px}
.db-search{padding:8px 14px;background:${SURFACE};border:1px solid ${BORDER};border-radius:8px;color:${TEXT};font-size:13px;width:220px}
.db-avatar{width:36px;height:36px;border-radius:50%;background:${ACCENT};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#000}
.db-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:28px}
.db-stat-card{background:${SURFACE};border:1px solid ${BORDER};border-radius:12px;padding:20px}
.db-stat-label{font-size:12px;color:${MUTED};margin-bottom:6px}
.db-stat-value{font-size:28px;font-weight:800;color:${TEXT}}
.db-stat-change{font-size:12px;margin-top:4px}
.db-stat-change.up{color:#22c55e}
.db-stat-change.down{color:#ef4444}
.db-charts{display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:28px}
.db-chart-card{background:${SURFACE};border:1px solid ${BORDER};border-radius:12px;padding:20px}
.db-chart-card h3{font-size:16px;margin-bottom:16px}
.db-chart-placeholder{height:200px;background:linear-gradient(180deg,rgba(201,169,78,.08),transparent);border-radius:8px;display:flex;align-items:center;justify-content:center;color:${MUTED};font-size:14px}
.db-table{background:${SURFACE};border:1px solid ${BORDER};border-radius:12px;padding:20px}
.db-table h3{font-size:16px;margin-bottom:16px}
.db-table table{width:100%;border-collapse:collapse}
.db-table th{text-align:left;font-size:12px;color:${MUTED};text-transform:uppercase;letter-spacing:.5px;padding:10px 12px;border-bottom:1px solid ${BORDER}}
.db-table td{padding:12px;font-size:14px;border-bottom:1px solid ${BORDER}}
.db-table .status{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}
.db-table .status.active{background:rgba(34,197,94,.15);color:#22c55e}
.db-table .status.pending{background:rgba(201,169,78,.15);color:${ACCENT}}
.db-table .status.failed{background:rgba(239,68,68,.15);color:#ef4444}
</style></head><body>
<div class="db-layout">
<aside class="db-sidebar"><div class="db-sidebar-brand"><span>&#9670;</span> AppDash</div>
<div class="db-sidebar-section">Main</div>
<a href="#" class="active">&#128202; Dashboard</a><a href="#">&#128196; Reports</a><a href="#">&#128101; Users</a><a href="#">&#128230; Products</a>
<div class="db-sidebar-section">Settings</div>
<a href="#">&#9881; General</a><a href="#">&#128274; Security</a><a href="#">&#128276; Notifications</a><a href="#">&#128257; Integrations</a>
<div style="flex:1"></div><a href="#" style="border-top:1px solid ${BORDER};padding-top:12px">&#128682; Logout</a></aside>
<main class="db-main">
<div class="db-topbar"><h1>Dashboard</h1><div class="db-topbar-right"><input class="db-search" placeholder="Search..."><div class="db-avatar">JB</div></div></div>
<div class="db-stats">
<div class="db-stat-card"><div class="db-stat-label">Total Revenue</div><div class="db-stat-value">$84,254</div><div class="db-stat-change up">+12.5% from last month</div></div>
<div class="db-stat-card"><div class="db-stat-label">Active Users</div><div class="db-stat-value">2,847</div><div class="db-stat-change up">+8.2% from last month</div></div>
<div class="db-stat-card"><div class="db-stat-label">Conversion Rate</div><div class="db-stat-value">3.24%</div><div class="db-stat-change down">-0.4% from last month</div></div>
<div class="db-stat-card"><div class="db-stat-label">Avg. Order Value</div><div class="db-stat-value">$142</div><div class="db-stat-change up">+5.1% from last month</div></div>
</div>
<div class="db-charts">
<div class="db-chart-card"><h3>Revenue Overview</h3><div class="db-chart-placeholder">Revenue chart area &mdash; integrate Chart.js or D3</div></div>
<div class="db-chart-card"><h3>Traffic Sources</h3><div class="db-chart-placeholder">Pie chart area</div></div>
</div>
<div class="db-table"><h3>Recent Transactions</h3><table><thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>
<tr><td>#ORD-2847</td><td>Sarah Mitchell</td><td>$234.00</td><td><span class="status active">Completed</span></td><td>Mar 6, 2026</td></tr>
<tr><td>#ORD-2846</td><td>James Cooper</td><td>$89.00</td><td><span class="status pending">Pending</span></td><td>Mar 6, 2026</td></tr>
<tr><td>#ORD-2845</td><td>Lisa Wang</td><td>$567.00</td><td><span class="status active">Completed</span></td><td>Mar 5, 2026</td></tr>
<tr><td>#ORD-2844</td><td>Mike Johnson</td><td>$45.00</td><td><span class="status failed">Failed</span></td><td>Mar 5, 2026</td></tr>
<tr><td>#ORD-2843</td><td>Emily Davis</td><td>$312.00</td><td><span class="status active">Completed</span></td><td>Mar 4, 2026</td></tr>
</tbody></table></div>
</main></div>
</body></html>`;

/* ---------- 10. Fitness Gym ---------- */
const fitnessGymHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLE}<style>
.gy-nav{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid ${BORDER}}
.gy-brand{font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:2px}
.gy-hero{text-align:center;padding:100px 24px;background:linear-gradient(180deg,rgba(201,169,78,.08),transparent)}
.gy-hero h1{font-size:54px;text-transform:uppercase;margin-bottom:16px;letter-spacing:2px}
.gy-hero p{font-size:18px;max-width:500px;margin:0 auto 36px}
.gy-classes{padding:80px 32px}
.gy-classes h2{text-align:center;margin-bottom:48px}
.gy-class-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1100px;margin:0 auto}
.gy-class{background:${SURFACE};border:1px solid ${BORDER};border-radius:12px;overflow:hidden}
.gy-class-img{height:180px;display:flex;align-items:center;justify-content:center;font-size:48px}
.gy-class-info{padding:20px}
.gy-class-info h3{margin-bottom:6px}
.gy-class-meta{display:flex;gap:16px;margin-top:10px;font-size:12px;color:${MUTED}}
.gy-trainers{padding:80px 32px;background:${SURFACE}}
.gy-trainers h2{text-align:center;margin-bottom:48px}
.gy-tr-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;max-width:1000px;margin:0 auto;text-align:center}
.gy-tr-img{width:110px;height:110px;border-radius:50%;background:linear-gradient(135deg,${BG},#2a3050);margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:32px}
.gy-tr h3{font-size:16px;margin-bottom:2px}
.gy-pricing{padding:80px 32px;text-align:center}
.gy-pricing h2{margin-bottom:48px}
.gy-price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:960px;margin:0 auto}
.gy-price-card{background:${SURFACE};border:1px solid ${BORDER};border-radius:14px;padding:36px}
.gy-price-card.popular{border-color:${ACCENT};box-shadow:0 0 30px rgba(201,169,78,.1)}
.gy-price-name{font-size:14px;text-transform:uppercase;letter-spacing:1px;color:${MUTED};margin-bottom:8px}
.gy-price-amount{font-size:44px;font-weight:800;color:${TEXT};margin-bottom:4px}
.gy-price-amount span{font-size:16px;color:${MUTED};font-weight:400}
.gy-price-features{list-style:none;margin:24px 0;display:flex;flex-direction:column;gap:10px;text-align:left}
.gy-price-features li{color:${MUTED};font-size:14px}
.gy-price-features li::before{content:'\\2713';color:${ACCENT};margin-right:8px;font-weight:700}
.gy-cta{padding:80px 32px;text-align:center;background:linear-gradient(135deg,rgba(201,169,78,.06),transparent)}
.gy-cta h2{margin-bottom:14px;text-transform:uppercase;letter-spacing:1px}
.gy-cta p{margin-bottom:32px}
.gy-footer{padding:40px 32px;border-top:1px solid ${BORDER};text-align:center;font-size:13px;color:${MUTED}}
</style></head><body>
<nav class="gy-nav"><div class="gy-brand" style="color:${ACCENT}">IronForge</div><div style="display:flex;gap:24px;align-items:center"><a href="#" style="color:${MUTED};font-size:14px">Classes</a><a href="#" style="color:${MUTED};font-size:14px">Trainers</a><a href="#" style="color:${MUTED};font-size:14px">Pricing</a><a href="#" style="color:${MUTED};font-size:14px">Schedule</a><a href="#" class="btn" style="padding:10px 22px;font-size:13px">Join Now</a></div></nav>
<section class="gy-hero"><h1>Forge Your<br><span style="color:${ACCENT}">Strongest</span> Self</h1><p>Elite training facility with world-class coaches, state-of-the-art equipment, and a community that pushes you beyond limits.</p><a href="#" class="btn">Start Free Trial</a></section>
<section class="gy-classes"><h2>Class Schedule</h2><div class="gy-class-grid">
<div class="gy-class"><div class="gy-class-img" style="background:linear-gradient(135deg,#2a1a1a,#401a20)">&#128170;</div><div class="gy-class-info"><h3>CrossFit WOD</h3><p>High-intensity functional training combining Olympic lifts, gymnastics, and cardio.</p><div class="gy-class-meta"><span>Mon/Wed/Fri 6am</span><span>60 min</span><span>All levels</span></div></div></div>
<div class="gy-class"><div class="gy-class-img" style="background:linear-gradient(135deg,#1a1a2a,#1a2040)">&#129336;</div><div class="gy-class-info"><h3>Boxing Bootcamp</h3><p>Technique drills, heavy bag work, and conditioning circuits with certified boxing coaches.</p><div class="gy-class-meta"><span>Tue/Thu 7am</span><span>45 min</span><span>Intermediate</span></div></div></div>
<div class="gy-class"><div class="gy-class-img" style="background:linear-gradient(135deg,#1a2a1a,#204020)">&#129495;</div><div class="gy-class-info"><h3>Power Yoga</h3><p>Athletic-style vinyasa flow focused on strength, flexibility, and mental focus.</p><div class="gy-class-meta"><span>Daily 8am</span><span>75 min</span><span>All levels</span></div></div></div>
</div></section>
<section class="gy-trainers"><h2>Our Coaches</h2><div class="gy-tr-grid">
<div><div class="gy-tr-img">&#128170;</div><h3>Jake Reeves</h3><p style="color:${ACCENT};font-size:12px">CrossFit L3</p><p style="font-size:13px">Former D1 athlete, 10 yrs coaching</p></div>
<div><div class="gy-tr-img">&#129336;</div><h3>Maya Santos</h3><p style="color:${ACCENT};font-size:12px">Boxing / HIIT</p><p style="font-size:13px">Pro boxing record 12-0, NASM cert</p></div>
<div><div class="gy-tr-img">&#129495;</div><h3>Aiden Wu</h3><p style="color:${ACCENT};font-size:12px">Yoga / Mobility</p><p style="font-size:13px">RYT-500, physical therapy background</p></div>
<div><div class="gy-tr-img">&#127947;</div><h3>Tanya Brooks</h3><p style="color:${ACCENT};font-size:12px">Strength / Olympic Lifting</p><p style="font-size:13px">National weightlifting champion</p></div>
</div></section>
<section class="gy-pricing"><h2>Membership Plans</h2><div class="gy-price-grid">
<div class="gy-price-card"><div class="gy-price-name">Basic</div><div class="gy-price-amount">$49<span>/mo</span></div><ul class="gy-price-features"><li>Gym floor access</li><li>Locker room</li><li>2 classes/week</li><li>Open gym hours</li></ul><a href="#" class="btn btn-outline" style="width:100%;text-align:center;display:block">Select Plan</a></div>
<div class="gy-price-card popular"><div class="gy-price-name" style="color:${ACCENT}">Pro</div><div class="gy-price-amount">$89<span>/mo</span></div><ul class="gy-price-features"><li>Everything in Basic</li><li>Unlimited classes</li><li>1 PT session/month</li><li>Sauna &amp; recovery</li><li>Nutrition coaching</li></ul><a href="#" class="btn" style="width:100%;text-align:center;display:block">Select Plan</a></div>
<div class="gy-price-card"><div class="gy-price-name">Elite</div><div class="gy-price-amount">$149<span>/mo</span></div><ul class="gy-price-features"><li>Everything in Pro</li><li>4 PT sessions/month</li><li>Body composition scan</li><li>Guest passes</li><li>Priority booking</li></ul><a href="#" class="btn btn-outline" style="width:100%;text-align:center;display:block">Select Plan</a></div>
</div></section>
<section class="gy-cta"><h2>First class is free</h2><p>No contracts. No commitments. Just results. Try any class on us.</p><a href="#" class="btn">Claim Free Class</a></section>
<footer class="gy-footer">&copy; 2026 IronForge Fitness. 4200 Steel Ave, Midland, TX 79701</footer>
</body></html>`;

/* ---------- 11. Education / Course ---------- */
const educationCourseHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLE}<style>
.ed-nav{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid ${BORDER}}
.ed-brand{font-size:20px;font-weight:800}
.ed-hero{padding:100px 32px 80px;text-align:center}
.ed-hero h1{font-size:48px;margin-bottom:16px}
.ed-hero p{font-size:17px;max-width:560px;margin:0 auto 36px}
.ed-stats-bar{display:flex;justify-content:center;gap:48px;padding:24px;background:${SURFACE};border-top:1px solid ${BORDER};border-bottom:1px solid ${BORDER}}
.ed-stat{text-align:center}
.ed-stat-val{font-size:24px;font-weight:800;color:${ACCENT}}
.ed-stat-lbl{font-size:12px;color:${MUTED};margin-top:2px}
.ed-courses{padding:80px 32px}
.ed-courses h2{text-align:center;margin-bottom:48px}
.ed-course-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1100px;margin:0 auto}
.ed-course{background:${SURFACE};border:1px solid ${BORDER};border-radius:12px;overflow:hidden}
.ed-course-img{height:160px;display:flex;align-items:center;justify-content:center;font-size:40px}
.ed-course-body{padding:20px}
.ed-course-tag{display:inline-block;padding:3px 10px;background:rgba(201,169,78,.1);color:${ACCENT};border-radius:12px;font-size:11px;font-weight:600;margin-bottom:10px}
.ed-course-body h3{font-size:17px;margin-bottom:8px}
.ed-course-meta{display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:14px;border-top:1px solid ${BORDER}}
.ed-course-price{font-size:20px;font-weight:800;color:${ACCENT}}
.ed-course-info{font-size:12px;color:${MUTED}}
.ed-instructor{padding:80px 32px;background:${SURFACE}}
.ed-instructor-inner{display:flex;gap:48px;align-items:center;max-width:900px;margin:0 auto}
.ed-inst-img{width:200px;height:200px;border-radius:16px;background:linear-gradient(135deg,${BG},#1a2a40);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:64px}
.ed-inst-text h2{margin-bottom:12px}
.ed-inst-text p{font-size:15px;margin-bottom:12px}
.ed-enroll{padding:80px 32px;text-align:center}
.ed-enroll h2{margin-bottom:14px}
.ed-enroll p{margin-bottom:32px}
.ed-features{display:flex;justify-content:center;gap:40px;margin-bottom:36px}
.ed-feat{text-align:center}
.ed-feat-icon{font-size:32px;margin-bottom:8px}
.ed-feat p{font-size:13px;color:${MUTED}}
.ed-footer{padding:40px 32px;border-top:1px solid ${BORDER};text-align:center;font-size:13px;color:${MUTED}}
</style></head><body>
<nav class="ed-nav"><div class="ed-brand">SkillForge Academy</div><div style="display:flex;gap:24px;align-items:center"><a href="#" style="color:${MUTED};font-size:14px">Courses</a><a href="#" style="color:${MUTED};font-size:14px">Instructors</a><a href="#" style="color:${MUTED};font-size:14px">Pricing</a><a href="#" style="color:${MUTED};font-size:14px">Blog</a><a href="#" class="btn" style="padding:10px 22px;font-size:13px">Enroll Now</a></div></nav>
<section class="ed-hero"><h1>Master In-Demand Skills</h1><p>Industry-led courses in AI, engineering, design, and business. Learn at your pace with lifetime access and real-world projects.</p><div style="display:flex;gap:14px;justify-content:center"><a href="#" class="btn">Browse Courses</a><a href="#" class="btn btn-outline">Free Preview</a></div></section>
<div class="ed-stats-bar"><div class="ed-stat"><div class="ed-stat-val">48</div><div class="ed-stat-lbl">Expert Courses</div></div><div class="ed-stat"><div class="ed-stat-val">12,000+</div><div class="ed-stat-lbl">Students Enrolled</div></div><div class="ed-stat"><div class="ed-stat-val">4.8/5</div><div class="ed-stat-lbl">Average Rating</div></div><div class="ed-stat"><div class="ed-stat-val">94%</div><div class="ed-stat-lbl">Completion Rate</div></div></div>
<section class="ed-courses"><h2>Popular Courses</h2><div class="ed-course-grid">
<div class="ed-course"><div class="ed-course-img" style="background:linear-gradient(135deg,#1a1a2a,#2a2050)">&#129302;</div><div class="ed-course-body"><span class="ed-course-tag">AI / ML</span><h3>AI Agent Development from Scratch</h3><p style="font-size:13px">Build autonomous agents with LLMs, tool use, and multi-step reasoning. No wrappers.</p><div class="ed-course-meta"><div class="ed-course-price">$199</div><div class="ed-course-info">24 hrs &middot; 12 modules</div></div></div></div>
<div class="ed-course"><div class="ed-course-img" style="background:linear-gradient(135deg,#1a2a1a,#204020)">&#128187;</div><div class="ed-course-body"><span class="ed-course-tag">Engineering</span><h3>Full-Stack TypeScript Mastery</h3><p style="font-size:13px">Next.js 15, Cloudflare Workers, D1, Drizzle ORM, and production deployment patterns.</p><div class="ed-course-meta"><div class="ed-course-price">$149</div><div class="ed-course-info">18 hrs &middot; 10 modules</div></div></div></div>
<div class="ed-course"><div class="ed-course-img" style="background:linear-gradient(135deg,#2a1a20,#401a30)">&#127912;</div><div class="ed-course-body"><span class="ed-course-tag">Design</span><h3>Design Systems at Scale</h3><p style="font-size:13px">Build component libraries in Figma and React that scale across 100+ engineers.</p><div class="ed-course-meta"><div class="ed-course-price">$129</div><div class="ed-course-info">14 hrs &middot; 8 modules</div></div></div></div>
</div></section>
<section class="ed-instructor"><div class="ed-instructor-inner"><div class="ed-inst-img">&#128104;&#8205;&#127891;</div><div class="ed-inst-text"><h2>Learn from Industry Veterans</h2><p>Our instructors are senior engineers and founders from companies like Google, Stripe, Cloudflare, and OpenAI. Every course is built from real production experience, not textbook theory.</p><p style="color:${ACCENT};font-weight:600">200+ combined years of industry experience</p><a href="#" class="btn btn-outline" style="margin-top:8px">Meet Our Instructors</a></div></div></section>
<section class="ed-enroll"><h2>Start Learning Today</h2><p>Join 12,000+ students building real-world skills with lifetime course access.</p><div class="ed-features">
<div class="ed-feat"><div class="ed-feat-icon">&#127891;</div><h3 style="font-size:15px">Certificates</h3><p>Earn verified completion certificates</p></div>
<div class="ed-feat"><div class="ed-feat-icon">&#128249;</div><h3 style="font-size:15px">HD Video</h3><p>High-quality video with code-along</p></div>
<div class="ed-feat"><div class="ed-feat-icon">&#128172;</div><h3 style="font-size:15px">Community</h3><p>Private Discord with instructors</p></div>
<div class="ed-feat"><div class="ed-feat-icon">&#9854;</div><h3 style="font-size:15px">Lifetime Access</h3><p>Pay once, learn forever</p></div>
</div><a href="#" class="btn">Browse All Courses</a></section>
<footer class="ed-footer">&copy; 2026 SkillForge Academy. <a href="#">Privacy</a> &middot; <a href="#">Terms</a> &middot; <a href="#">Refund Policy</a></footer>
</body></html>`;

/* ---------- 12. Nonprofit ---------- */
const nonprofitHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLE}<style>
.np-nav{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid ${BORDER}}
.np-brand{font-size:20px;font-weight:800;display:flex;align-items:center;gap:8px}
.np-hero{text-align:center;padding:100px 24px;background:linear-gradient(180deg,rgba(201,169,78,.06),transparent)}
.np-hero h1{font-size:50px;margin-bottom:16px}
.np-hero p{font-size:18px;max-width:560px;margin:0 auto 36px}
.np-impact{padding:60px 32px;display:flex;justify-content:center;gap:60px;text-align:center}
.np-impact-num{font-size:44px;font-weight:800;color:${ACCENT}}
.np-impact-label{font-size:14px;color:${MUTED};margin-top:4px}
.np-mission{padding:80px 32px;background:${SURFACE}}
.np-mission-inner{display:flex;gap:48px;align-items:center;max-width:1000px;margin:0 auto}
.np-mission-img{width:380px;height:300px;border-radius:16px;background:linear-gradient(135deg,#1a2a20,#203a30);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:64px}
.np-mission-text h2{margin-bottom:16px}
.np-mission-text p{font-size:15px;margin-bottom:14px}
.np-programs{padding:80px 32px}
.np-programs h2{text-align:center;margin-bottom:48px}
.np-prog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;max-width:1100px;margin:0 auto}
.np-prog{background:${SURFACE};border:1px solid ${BORDER};border-radius:12px;padding:28px}
.np-prog-icon{font-size:36px;margin-bottom:12px}
.np-prog h3{margin-bottom:8px}
.np-donate{padding:80px 32px;text-align:center;background:linear-gradient(135deg,rgba(201,169,78,.08),transparent)}
.np-donate h2{margin-bottom:12px}
.np-donate>p{margin-bottom:32px}
.np-donate-amounts{display:flex;gap:14px;justify-content:center;margin-bottom:24px}
.np-amt{padding:14px 28px;background:${SURFACE};border:2px solid ${BORDER};border-radius:10px;font-size:18px;font-weight:700;color:${TEXT};cursor:pointer}
.np-amt.selected{border-color:${ACCENT};color:${ACCENT};background:rgba(201,169,78,.08)}
.np-team{padding:80px 32px;background:${SURFACE}}
.np-team h2{text-align:center;margin-bottom:48px}
.np-team-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;max-width:1000px;margin:0 auto;text-align:center}
.np-team-img{width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,${BG},#2a3050);margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:28px}
.np-team-member h3{font-size:15px;margin-bottom:2px}
.np-team-member p{font-size:13px}
.np-newsletter{padding:60px 32px;text-align:center}
.np-newsletter h2{margin-bottom:12px}
.np-newsletter p{margin-bottom:24px}
.np-newsletter-form{display:flex;gap:10px;justify-content:center;max-width:480px;margin:0 auto}
.np-newsletter-form input{flex:1;padding:12px 16px;background:${SURFACE};border:1px solid ${BORDER};border-radius:8px;color:${TEXT};font-size:14px}
.np-footer{padding:40px 32px;border-top:1px solid ${BORDER};text-align:center;font-size:13px;color:${MUTED}}
</style></head><body>
<nav class="np-nav"><div class="np-brand"><span style="color:${ACCENT}">&#127807;</span> BrightFuture Foundation</div><div style="display:flex;gap:24px;align-items:center"><a href="#" style="color:${MUTED};font-size:14px">Mission</a><a href="#" style="color:${MUTED};font-size:14px">Programs</a><a href="#" style="color:${MUTED};font-size:14px">Impact</a><a href="#" style="color:${MUTED};font-size:14px">Team</a><a href="#" class="btn" style="padding:10px 22px;font-size:13px">Donate Now</a></div></nav>
<section class="np-hero"><h1>Clean Water Changes<br><span style="color:${ACCENT}">Everything</span></h1><p>We bring sustainable clean water solutions to communities in need. Every dollar funds filtration systems, wells, and education programs that save lives.</p><div style="display:flex;gap:14px;justify-content:center"><a href="#" class="btn">Donate Now</a><a href="#" class="btn btn-outline">Our Impact</a></div></section>
<div class="np-impact">
<div><div class="np-impact-num">2.4M</div><div class="np-impact-label">People Served</div></div>
<div><div class="np-impact-num">1,200+</div><div class="np-impact-label">Wells Built</div></div>
<div><div class="np-impact-num">34</div><div class="np-impact-label">Countries Reached</div></div>
<div><div class="np-impact-num">96%</div><div class="np-impact-label">Funds to Programs</div></div>
</div>
<section class="np-mission"><div class="np-mission-inner"><div class="np-mission-img">&#127807;</div><div class="np-mission-text"><h2>Our Mission</h2><p>BrightFuture Foundation was founded in 2018 with a simple belief: access to clean water is a human right, not a privilege. We partner with local communities to build sustainable water infrastructure that lasts for generations.</p><p>Unlike traditional aid models, we train local technicians to maintain every system we install. This creates jobs, builds capacity, and ensures communities own their water future.</p><p style="color:${ACCENT};font-weight:600">$25 provides clean water for one person for 10 years.</p></div></div></section>
<section class="np-programs"><h2>Our Programs</h2><div class="np-prog-grid">
<div class="np-prog"><div class="np-prog-icon">&#128167;</div><h3>Well Construction</h3><p>Building deep-bore wells with solar-powered pumps that serve communities of 500+ people for 20+ years.</p></div>
<div class="np-prog"><div class="np-prog-icon">&#127891;</div><h3>Education</h3><p>Training local technicians in water system maintenance, hygiene education, and sanitation best practices.</p></div>
<div class="np-prog"><div class="np-prog-icon">&#128300;</div><h3>Water Quality Testing</h3><p>Regular testing and monitoring of water sources to ensure ongoing safety and purity standards.</p></div>
</div></section>
<section class="np-donate"><h2>Make a Difference Today</h2><p>100% of public donations go directly to water programs. Administrative costs are covered by our founding partners.</p><div class="np-donate-amounts"><div class="np-amt">$25</div><div class="np-amt selected">$50</div><div class="np-amt">$100</div><div class="np-amt">$250</div><div class="np-amt">Other</div></div><a href="#" class="btn">Donate Now</a><p style="font-size:12px;margin-top:14px">Tax-deductible. EIN: 84-3291847. Charity Navigator 4-Star rated.</p></section>
<section class="np-team"><h2>Our Leadership</h2><div class="np-team-grid">
<div class="np-team-member"><div class="np-team-img">&#128100;</div><h3>Maria Gonzalez</h3><p style="color:${ACCENT};font-size:12px">Executive Director</p><p>Former UN Water Advisor</p></div>
<div class="np-team-member"><div class="np-team-img">&#128100;</div><h3>Thomas Njeru</h3><p style="color:${ACCENT};font-size:12px">Operations Director</p><p>15 years field operations</p></div>
<div class="np-team-member"><div class="np-team-img">&#128100;</div><h3>Sarah Chen</h3><p style="color:${ACCENT};font-size:12px">Development Director</p><p>McKinsey alum, impact investing</p></div>
<div class="np-team-member"><div class="np-team-img">&#128100;</div><h3>Dr. Ahmed Hassan</h3><p style="color:${ACCENT};font-size:12px">Science Advisor</p><p>MIT water systems researcher</p></div>
</div></section>
<section class="np-newsletter"><h2>Stay Connected</h2><p>Get monthly impact reports and stories from the field.</p><form class="np-newsletter-form"><input type="email" placeholder="Enter your email"><button type="button" class="btn">Subscribe</button></form></section>
<footer class="np-footer"><p>&copy; 2026 BrightFuture Foundation. 501(c)(3) Nonprofit Organization.</p><p style="margin-top:6px"><a href="#">Privacy Policy</a> &middot; <a href="#">Annual Report</a> &middot; <a href="#">Financial Transparency</a></p></footer>
</body></html>`;


/* =========================================================================
   TEMPLATE CATALOG — FULL EXPORT
   ========================================================================= */

export const TEMPLATE_CATALOG: TemplateDefinition[] = [
  {
    id: 'saas-landing',
    name: 'SaaS Landing Page',
    description: 'Modern SaaS product page with hero, features grid, tiered pricing, CTA section, and footer. Perfect for software startups.',
    category: 'saas',
    tags: ['saas', 'startup', 'software', 'pricing', 'features', 'landing'],
    thumbnail: 'linear-gradient(135deg, #1a1f2e 0%, #0f1219 50%, #C9A94E22 100%)',
    html: saasLandingHtml,
    recommendedPages: ['Home', 'Features', 'Pricing', 'Docs', 'Blog', 'Contact'],
  },
  {
    id: 'portfolio',
    name: 'Minimalist Portfolio',
    description: 'Clean portfolio layout with work grid, about section, and contact CTA. Ideal for designers, developers, and freelancers.',
    category: 'creative',
    tags: ['portfolio', 'designer', 'freelancer', 'creative', 'minimal', 'personal'],
    thumbnail: 'linear-gradient(135deg, #0f1219 0%, #1a2540 50%, #C9A94E15 100%)',
    html: portfolioHtml,
    recommendedPages: ['Home', 'Work', 'About', 'Contact', 'Resume'],
  },
  {
    id: 'ecommerce-store',
    name: 'E-Commerce Store',
    description: 'Product-focused store with featured items, category browsing, product cards with pricing, and cart integration points.',
    category: 'ecommerce',
    tags: ['ecommerce', 'store', 'shop', 'products', 'cart', 'retail'],
    thumbnail: 'linear-gradient(135deg, #1a1f2e 0%, #2a3860 50%, #C9A94E18 100%)',
    html: ecommerceHtml,
    recommendedPages: ['Home', 'Shop', 'Collections', 'Cart', 'About', 'Contact'],
  },
  {
    id: 'restaurant',
    name: 'Fine Dining Restaurant',
    description: 'Elegant restaurant page with menu display, reservation form, ambiance gallery, and contact details.',
    category: 'business',
    tags: ['restaurant', 'food', 'dining', 'menu', 'reservation', 'hospitality'],
    thumbnail: 'linear-gradient(135deg, #1a1510 0%, #0f1219 50%, #C9A94E20 100%)',
    html: restaurantHtml,
    recommendedPages: ['Home', 'Menu', 'Reservations', 'Private Events', 'About', 'Contact'],
  },
  {
    id: 'blog-magazine',
    name: 'Blog & Magazine',
    description: 'Content-rich blog layout with featured article, article grid, sidebar with tags and trending posts.',
    category: 'personal',
    tags: ['blog', 'magazine', 'articles', 'news', 'content', 'publishing'],
    thumbnail: 'linear-gradient(135deg, #0f1219 0%, #1a2030 50%, #C9A94E12 100%)',
    html: blogMagazineHtml,
    recommendedPages: ['Home', 'Technology', 'Design', 'Business', 'About', 'Subscribe'],
  },
  {
    id: 'agency',
    name: 'Creative Agency',
    description: 'Full-service agency site with services overview, case studies, team profiles, and project CTA.',
    category: 'business',
    tags: ['agency', 'creative', 'services', 'case-studies', 'team', 'marketing'],
    thumbnail: 'linear-gradient(135deg, #1a1f2e 0%, #0f1219 30%, #C9A94E15 100%)',
    html: agencyHtml,
    recommendedPages: ['Home', 'Services', 'Work', 'Team', 'Blog', 'Contact'],
  },
  {
    id: 'real-estate',
    name: 'Real Estate Listings',
    description: 'Property listing site with search filters, featured properties, agent profiles, and market stats.',
    category: 'professional',
    tags: ['real-estate', 'property', 'listings', 'agents', 'housing', 'search'],
    thumbnail: 'linear-gradient(135deg, #0f1219 0%, #1a2540 40%, #C9A94E18 100%)',
    html: realEstateHtml,
    recommendedPages: ['Home', 'Buy', 'Sell', 'Rent', 'Agents', 'Contact'],
  },
  {
    id: 'medical-clinic',
    name: 'Medical Clinic',
    description: 'Healthcare practice site with specialty services, doctor profiles, appointment booking, and trust indicators.',
    category: 'professional',
    tags: ['medical', 'healthcare', 'clinic', 'doctor', 'appointments', 'hospital'],
    thumbnail: 'linear-gradient(135deg, #0a1a2a 0%, #152540 50%, #C9A94E12 100%)',
    html: medicalClinicHtml,
    recommendedPages: ['Home', 'Services', 'Doctors', 'Appointments', 'Insurance', 'Contact'],
  },
  {
    id: 'dashboard-app',
    name: 'Dashboard Application',
    description: 'Admin dashboard with sidebar navigation, stat cards, chart placeholders, and data table. Ready for Chart.js integration.',
    category: 'saas',
    tags: ['dashboard', 'admin', 'analytics', 'app', 'charts', 'data'],
    thumbnail: 'linear-gradient(135deg, #1a1f2e 0%, #0f1219 40%, #C9A94E10 100%)',
    html: dashboardAppHtml,
    recommendedPages: ['Dashboard', 'Reports', 'Users', 'Products', 'Settings'],
  },
  {
    id: 'fitness-gym',
    name: 'Fitness & Gym',
    description: 'High-energy gym site with class schedule, trainer profiles, tiered membership pricing, and free trial CTA.',
    category: 'business',
    tags: ['fitness', 'gym', 'classes', 'trainers', 'membership', 'health'],
    thumbnail: 'linear-gradient(135deg, #2a1a1a 0%, #0f1219 50%, #C9A94E15 100%)',
    html: fitnessGymHtml,
    recommendedPages: ['Home', 'Classes', 'Trainers', 'Pricing', 'Schedule', 'Contact'],
  },
  {
    id: 'education-course',
    name: 'Online Education',
    description: 'Course platform with catalog grid, instructor showcase, enrollment stats, and certificate program highlights.',
    category: 'professional',
    tags: ['education', 'courses', 'online-learning', 'instructor', 'enrollment', 'academy'],
    thumbnail: 'linear-gradient(135deg, #1a1a2a 0%, #2a2050 50%, #C9A94E12 100%)',
    html: educationCourseHtml,
    recommendedPages: ['Home', 'Courses', 'Instructors', 'Pricing', 'Blog', 'Contact'],
  },
  {
    id: 'nonprofit',
    name: 'Nonprofit Organization',
    description: 'Mission-driven nonprofit page with impact stats, programs overview, donation CTA, team profiles, and newsletter signup.',
    category: 'business',
    tags: ['nonprofit', 'charity', 'donation', 'impact', 'mission', 'cause'],
    thumbnail: 'linear-gradient(135deg, #1a2a20 0%, #0f1219 50%, #C9A94E15 100%)',
    html: nonprofitHtml,
    recommendedPages: ['Home', 'Mission', 'Programs', 'Impact', 'Donate', 'Contact'],
  },
];

/**
 * Filter templates by category.
 */
export function getTemplatesByCategory(category: TemplateCategory): TemplateDefinition[] {
  return TEMPLATE_CATALOG.filter((t) => t.category === category);
}
