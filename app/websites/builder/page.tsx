'use client';

import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import BuilderTopBar from '../../../components/builder/BuilderTopBar';
import BuilderSidebar from '../../../components/builder/BuilderSidebar';
import AskEchoPrime from '../../../components/builder/AskEchoPrime';
import SectionBrowser from '../../../components/builder/SectionBrowser';
import TemplateGallery from '../../../components/builder/TemplateGallery';
import PagesPanel from '../../../components/builder/PagesPanel';
import SettingsPanel from '../../../components/builder/SettingsPanel';
import AssetManager from '../../../components/builder/AssetManager';
import type { BuilderPage, SiteSettings } from '../../../lib/builder/types';
import { COLOR_THEMES, FONT_PAIRINGS } from '../../../lib/builder/types';
import BuilderTutorialPanel from '../../../components/builder-tutorial-panel';

/* ───────────────────────────────────────────────────────
   TEMPLATE HTML — 20 industry templates
   ─────────────────────────────────────────────────────── */

function nav(brand: string, links: string[], cta: string, accent = '#C9A94E') {
  const ls = links.map(l => `<a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">${l}</a>`).join('');
  return `<nav style="display:flex;align-items:center;justify-content:space-between;padding:16px 32px;background:#0f1219;border-bottom:1px solid #2a2f3e"><div style="font-size:20px;font-weight:800;color:${accent}">${brand}</div><div style="display:flex;gap:24px">${ls}</div><a href="#" style="padding:10px 24px;background:${accent};color:#fff;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">${cta}</a></nav>`;
}

function hero(title: string, subtitle: string, btnText: string, accent = '#C9A94E') {
  return `<section style="padding:100px 24px;text-align:center;background:linear-gradient(135deg,#0a0f1c,#1a1f2e)"><h1 style="font-size:52px;font-weight:800;color:#fff;margin-bottom:16px">${title}</h1><p style="font-size:18px;color:#9ca3af;max-width:600px;margin:0 auto 32px">${subtitle}</p><a href="#" style="display:inline-block;padding:16px 40px;background:${accent};color:#fff;border-radius:12px;font-weight:600;text-decoration:none;font-size:16px">${btnText}</a></section>`;
}

function grid3(heading: string, items: { t: string; d: string }[]) {
  const cards = items.map(i => `<div style="padding:24px;border:1px solid #e5e7eb;border-radius:16px"><h3 style="font-size:18px;font-weight:600;margin-bottom:8px">${i.t}</h3><p style="font-size:14px;color:#6b7280">${i.d}</p></div>`).join('');
  return `<section style="padding:80px 24px;max-width:1024px;margin:0 auto"><h2 style="font-size:32px;font-weight:700;text-align:center;margin-bottom:48px">${heading}</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px">${cards}</div></section>`;
}

function ctaSection(title: string, sub: string, btn: string, accent = '#C9A94E') {
  return `<section style="padding:80px 24px;text-align:center;background:${accent}"><h2 style="font-size:36px;font-weight:700;color:#fff;margin-bottom:16px">${title}</h2><p style="font-size:16px;color:rgba(255,255,255,.85);margin-bottom:32px;max-width:500px;margin-left:auto;margin-right:auto">${sub}</p><a href="#" style="display:inline-block;padding:14px 36px;background:#fff;color:#0f1219;border-radius:12px;font-weight:600;text-decoration:none">${btn}</a></section>`;
}

function footer(brand: string) {
  return `<footer style="padding:48px 32px;background:#0a0e17;text-align:center;border-top:1px solid #1e2536"><p style="color:#6b7280;font-size:13px">&copy; 2026 ${brand}. All rights reserved.</p></footer>`;
}

const TEMPLATE_HTML: Record<string, string> = {
  'law-firm': nav('Sterling & Associates', ['Practice Areas', 'Attorneys', 'Case Results', 'Contact'], 'Free Consultation', '#1e3a5f') + hero('Experienced Legal Representation', 'Protecting your rights with decades of courtroom experience. Personal injury, business litigation, and family law.', 'Schedule Consultation', '#1e3a5f') + grid3('Practice Areas', [{ t: 'Personal Injury', d: 'Aggressive representation for accident victims.' }, { t: 'Business Law', d: 'Corporate formation, contracts, and disputes.' }, { t: 'Family Law', d: 'Divorce, custody, and support matters.' }]) + ctaSection('Need Legal Help?', 'Contact us today for a free, confidential consultation.', 'Call Now', '#1e3a5f') + footer('Sterling & Associates'),
  'dental-clinic': nav('Bright Smile Dental', ['Services', 'Team', 'Insurance', 'Book Online'], 'Book Appointment', '#2dd4bf') + hero('Your Smile, Our Priority', 'Comprehensive dental care for the whole family. Modern technology, gentle approach.', 'Schedule Visit', '#2dd4bf') + grid3('Our Services', [{ t: 'General Dentistry', d: 'Cleanings, fillings, and preventive care.' }, { t: 'Cosmetic', d: 'Whitening, veneers, and smile makeovers.' }, { t: 'Orthodontics', d: 'Invisalign and traditional braces.' }]) + ctaSection('New Patient Special', '$99 exam, x-rays, and cleaning for new patients.', 'Claim Offer', '#2dd4bf') + footer('Bright Smile Dental'),
  'restaurant': nav('Trattoria Roma', ['Menu', 'Reservations', 'Catering', 'About'], 'Reserve Table', '#dc2626') + hero('Authentic Italian Cuisine', 'Handmade pasta, wood-fired pizza, and the finest wines in an intimate setting.', 'View Menu', '#dc2626') + grid3('Our Specialties', [{ t: 'Handmade Pasta', d: 'Fresh daily, traditional recipes from Nonna.' }, { t: 'Wood-Fired Pizza', d: 'Neapolitan style, 900°F brick oven.' }, { t: 'Fine Wines', d: 'Curated selection from Italian vineyards.' }]) + ctaSection('Private Events', 'Host your next celebration in our private dining room.', 'Inquire Now', '#dc2626') + footer('Trattoria Roma'),
  'fitness': nav('Peak Performance', ['Classes', 'Trainers', 'Membership', 'Schedule'], 'Start Free Trial', '#f97316') + hero('Transform Your Body', 'State-of-the-art equipment, expert trainers, and a community that pushes you further.', 'Join Today', '#f97316') + grid3('Programs', [{ t: 'HIIT Training', d: 'High-intensity intervals for maximum burn.' }, { t: 'Yoga & Mindfulness', d: 'Find your center with guided sessions.' }, { t: 'Personal Training', d: 'Custom plans tailored to your goals.' }]) + ctaSection('7-Day Free Trial', 'No commitment. Cancel anytime. Start your fitness journey today.', 'Get Started', '#f97316') + footer('Peak Performance'),
  'saas': nav('CloudSync', ['Features', 'Pricing', 'Docs', 'Blog'], 'Start Free', '#7c3aed') + hero('Sync Everything. Everywhere.', 'Real-time collaboration platform for modern teams. Files, messages, and tasks in one place.', 'Start Free Trial', '#7c3aed') + grid3('Why CloudSync?', [{ t: 'Real-Time Sync', d: 'Changes propagate instantly across all devices.' }, { t: 'End-to-End Encryption', d: 'Your data stays private. Always.' }, { t: '99.99% Uptime', d: 'Enterprise-grade infrastructure you can rely on.' }]) + ctaSection('Ready to get started?', 'Free for teams up to 10 people. No credit card required.', 'Create Account', '#7c3aed') + footer('CloudSync'),
  'photography': nav('Lens & Light', ['Portfolio', 'Services', 'Pricing', 'Contact'], 'Book Session') + hero('Capturing Your Story', 'Award-winning photography for weddings, portraits, and commercial projects.', 'View Portfolio') + grid3('Services', [{ t: 'Weddings', d: 'Candid moments and timeless portraits.' }, { t: 'Portraits', d: 'Professional headshots and family photos.' }, { t: 'Commercial', d: 'Product photography and brand content.' }]) + ctaSection('Book Your Session', 'Limited availability. Reserve your date today.', 'Get in Touch') + footer('Lens & Light Studio'),
  'construction': nav('BuildRight Construction', ['Services', 'Projects', 'About', 'Quote'], 'Free Estimate', '#eab308') + hero('Building Excellence Since 1998', 'Commercial and residential construction with uncompromising quality and safety standards.', 'Request Quote', '#eab308') + grid3('Our Services', [{ t: 'Commercial Build', d: 'Office buildings, retail, and warehouses.' }, { t: 'Residential', d: 'Custom homes and renovations.' }, { t: 'Project Management', d: 'Full-service from design to completion.' }]) + ctaSection('Start Your Project', 'Free estimates and consultations. Licensed and insured.', 'Get Estimate', '#eab308') + footer('BuildRight Construction'),
  'real-estate': nav('Premier Properties', ['Listings', 'Sell', 'Agents', 'About'], 'Find Home', '#059669') + hero('Find Your Dream Home', 'Luxury real estate in the most desirable neighborhoods. Expert agents, exceptional results.', 'Browse Listings', '#059669') + grid3('Why Choose Us', [{ t: 'Market Expertise', d: 'Deep knowledge of local real estate markets.' }, { t: 'Global Network', d: 'Access to exclusive off-market properties.' }, { t: 'Full Service', d: 'From search to closing, we handle everything.' }]) + ctaSection('List Your Property', 'Get a free market analysis and pricing strategy.', 'Contact Agent', '#059669') + footer('Premier Properties'),
  'auto-repair': nav('Precision Auto', ['Services', 'Specials', 'Reviews', 'Schedule'], 'Book Service', '#ef4444') + hero('Expert Auto Repair', 'ASE-certified technicians. Fair prices. Honest service. All makes and models.', 'Schedule Service', '#ef4444') + grid3('Services', [{ t: 'Diagnostics', d: 'Computer diagnostics and inspections.' }, { t: 'Brake Service', d: 'Pads, rotors, and complete brake systems.' }, { t: 'Oil Change', d: 'Conventional and synthetic oil services.' }]) + ctaSection('New Customer Special', '$25 off your first service. Mention this offer.', 'Claim Discount', '#ef4444') + footer('Precision Auto'),
  'accounting': nav('Apex Financial', ['Services', 'Industries', 'Team', 'Contact'], 'Free Consult', '#0891b2') + hero('Strategic Financial Solutions', 'Tax planning, bookkeeping, and advisory services for businesses and individuals.', 'Schedule Meeting', '#0891b2') + grid3('Services', [{ t: 'Tax Planning', d: 'Minimize liability with proactive strategies.' }, { t: 'Bookkeeping', d: 'Accurate, timely financial records.' }, { t: 'CFO Advisory', d: 'Strategic guidance for growing businesses.' }]) + ctaSection('Tax Season Ready?', 'Start your tax preparation early. Book a consultation today.', 'Get Started', '#0891b2') + footer('Apex Financial'),
  'medical': nav('MedCare Clinic', ['Specialties', 'Providers', 'Patient Portal', 'Contact'], 'Book Visit', '#0d9488') + hero('Compassionate Healthcare', 'Board-certified physicians providing comprehensive medical care for you and your family.', 'Schedule Appointment', '#0d9488') + grid3('Specialties', [{ t: 'Primary Care', d: 'Preventive care and chronic disease management.' }, { t: 'Pediatrics', d: 'Expert care for children of all ages.' }, { t: 'Urgent Care', d: 'Walk-in visits for immediate needs.' }]) + ctaSection('New Patients Welcome', 'Same-day appointments available. Most insurance accepted.', 'Book Now', '#0d9488') + footer('MedCare Clinic'),
  'ecommerce': nav('ShopModern', ['New Arrivals', 'Collections', 'Sale', 'About'], 'Shop Now', '#ec4899') + hero('Summer Collection 2026', 'Discover the latest trends. Free shipping on orders over $75.', 'Shop the Collection', '#ec4899') + grid3('Shop by Category', [{ t: 'Women', d: 'Dresses, tops, and accessories.' }, { t: 'Men', d: 'Shirts, pants, and outerwear.' }, { t: 'Accessories', d: 'Bags, jewelry, and watches.' }]) + ctaSection('Join the Club', 'Get 15% off your first order. Exclusive deals and early access.', 'Sign Up', '#ec4899') + footer('ShopModern'),
  'tech-startup': nav('NeuralStack', ['Platform', 'Solutions', 'Developers', 'Pricing'], 'Get API Key', '#6366f1') + hero('AI Infrastructure for Developers', 'Deploy machine learning models at scale. One API. Zero DevOps. Infinite possibilities.', 'Start Building', '#6366f1') + grid3('Platform Features', [{ t: 'Auto-Scaling', d: 'From zero to millions of requests seamlessly.' }, { t: 'Model Hub', d: '500+ pre-trained models ready to deploy.' }, { t: 'Edge Inference', d: 'Sub-50ms latency from 200+ global PoPs.' }]) + ctaSection('Free Tier Available', '100K API calls/month free. No credit card required.', 'Create Account', '#6366f1') + footer('NeuralStack'),
  'church': nav('Grace Community', ['Services', 'Ministries', 'Events', 'Give'], 'Plan Your Visit', '#a855f7') + hero('Welcome Home', 'A place where faith meets community. Join us for worship every Sunday at 10 AM.', 'Plan Your Visit', '#a855f7') + grid3('Get Involved', [{ t: 'Sunday Worship', d: '10 AM service with contemporary and traditional music.' }, { t: 'Small Groups', d: 'Connect with others in weekly Bible study.' }, { t: 'Youth Ministry', d: 'Programs for middle and high school students.' }]) + ctaSection('Join Us This Sunday', 'First-time visitors receive a free welcome gift.', 'Get Directions', '#a855f7') + footer('Grace Community Church'),
  'consulting': nav('Apex Strategy', ['Services', 'Case Studies', 'Team', 'Insights'], 'Book Discovery Call') + hero('Strategic Growth Partners', 'Management consulting for mid-market companies. Revenue growth, operational excellence, digital transformation.', 'Schedule Call') + grid3('How We Help', [{ t: 'Growth Strategy', d: 'Market entry, expansion, and revenue optimization.' }, { t: 'Operations', d: 'Process improvement and cost reduction.' }, { t: 'Digital', d: 'Technology roadmap and implementation.' }]) + ctaSection('Free Strategy Session', '30-minute discovery call. No obligation.', 'Book Now') + footer('Apex Strategy Group'),
  'pet-care': nav('Happy Tails', ['Services', 'Gallery', 'Pricing', 'Book Online'], 'Book Now', '#10b981') + hero('Love & Care for Your Pets', 'Professional grooming, daycare, and boarding in a home-like environment.', 'Book Appointment', '#10b981') + grid3('Services', [{ t: 'Grooming', d: 'Bath, trim, nail care, and styling.' }, { t: 'Daycare', d: 'Supervised play in our indoor/outdoor facility.' }, { t: 'Boarding', d: 'Overnight stays with 24/7 care.' }]) + ctaSection('First Visit 20% Off', 'New clients save on their first grooming session.', 'Claim Offer', '#10b981') + footer('Happy Tails Pet Spa'),
  'education': nav('BrightPath Academy', ['Programs', 'Admissions', 'Faculty', 'Campus'], 'Apply Now', '#3b82f6') + hero('Unlock Your Potential', 'Innovative education that prepares students for tomorrow. Small classes. Big futures.', 'Schedule Tour', '#3b82f6') + grid3('Programs', [{ t: 'STEM Focus', d: 'Hands-on science, technology, engineering, math.' }, { t: 'Arts & Humanities', d: 'Creative expression and critical thinking.' }, { t: 'Athletics', d: '15 varsity sports and fitness programs.' }]) + ctaSection('Enroll for Fall 2026', 'Applications now open. Financial aid available.', 'Apply Today', '#3b82f6') + footer('BrightPath Academy'),
  'plumbing': nav('FlowRight Plumbing', ['Services', 'Emergency', 'Reviews', 'Contact'], 'Call Now', '#0ea5e9') + hero('Fast. Reliable. Affordable.', '24/7 emergency plumbing service. Licensed, bonded, and insured. Free estimates on all work.', 'Get Free Estimate', '#0ea5e9') + grid3('Services', [{ t: 'Emergency Repair', d: 'Burst pipes, flooding, and urgent fixes.' }, { t: 'Drain Cleaning', d: 'Camera inspection and hydro jetting.' }, { t: 'Water Heaters', d: 'Installation, repair, and replacement.' }]) + ctaSection('$50 Off First Service', 'New customers save on any plumbing service over $200.', 'Claim Discount', '#0ea5e9') + footer('FlowRight Plumbing'),
  'nonprofit': nav('Hope Foundation', ['Mission', 'Programs', 'Impact', 'Get Involved'], 'Donate Now', '#f59e0b') + hero('Creating Change Together', 'Empowering communities through education, healthcare, and sustainable development since 2005.', 'Support Our Mission', '#f59e0b') + grid3('Our Impact', [{ t: '50,000+ Lives', d: 'Direct beneficiaries across 12 countries.' }, { t: '200+ Schools', d: 'Built and supported in underserved areas.' }, { t: '$2M+ Raised', d: 'Through generous donations and grants.' }]) + ctaSection('Every Dollar Counts', '95 cents of every dollar goes directly to programs.', 'Donate Today', '#f59e0b') + footer('Hope Foundation'),
  'insurance': nav('Shield Insurance', ['Personal', 'Business', 'Claims', 'About'], 'Get Quote', '#1d4ed8') + hero('Protection You Can Trust', 'Comprehensive insurance solutions for auto, home, business, and life. Local agents, national strength.', 'Get Free Quote', '#1d4ed8') + grid3('Coverage Options', [{ t: 'Auto Insurance', d: 'Competitive rates with full coverage options.' }, { t: 'Home Insurance', d: 'Protect your biggest investment.' }, { t: 'Business Insurance', d: 'Tailored policies for every industry.' }]) + ctaSection('Bundle & Save 25%', 'Combine auto and home for maximum savings.', 'Get Quote', '#1d4ed8') + footer('Shield Insurance Group'),
};

/* ─── Custom GrapeJS blocks ─── */
const EPT_BLOCKS = [
  { id: 'ept-hero', label: 'Hero Section', category: 'Sections', content: '<section style="padding:100px 24px;text-align:center;background:linear-gradient(135deg,#0a0f1c,#1a1f2e)"><h1 style="font-size:48px;font-weight:800;color:#fff">Your Headline Here</h1><p style="font-size:18px;color:#9ca3af;max-width:600px;margin:16px auto 32px">Describe your business in one compelling sentence.</p><a href="#" style="display:inline-block;padding:14px 36px;background:#C9A94E;color:#fff;border-radius:10px;font-weight:600;text-decoration:none">Get Started</a></section>' },
  { id: 'ept-nav', label: 'Navigation', category: 'Sections', content: '<nav style="display:flex;align-items:center;justify-content:space-between;padding:16px 32px;background:#0f1219;border-bottom:1px solid #2a2f3e"><div style="font-size:20px;font-weight:800;color:#C9A94E">Brand</div><div style="display:flex;gap:24px"><a href="#" style="color:#9ca3af;text-decoration:none">Home</a><a href="#" style="color:#9ca3af;text-decoration:none">About</a><a href="#" style="color:#9ca3af;text-decoration:none">Services</a><a href="#" style="color:#9ca3af;text-decoration:none">Contact</a></div><a href="#" style="padding:8px 20px;background:#C9A94E;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">CTA</a></nav>' },
  { id: 'ept-features', label: 'Features Grid', category: 'Sections', content: '<section style="padding:80px 24px;max-width:1024px;margin:0 auto"><h2 style="font-size:32px;font-weight:700;text-align:center;margin-bottom:48px;color:#fff">Features</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px"><div style="padding:32px;border:1px solid #2a2f3e;border-radius:12px;background:#1a1f2e"><h3 style="font-size:18px;font-weight:600;color:#fff;margin-bottom:8px">Feature One</h3><p style="color:#9ca3af;font-size:14px">Brief description of the feature.</p></div><div style="padding:32px;border:1px solid #2a2f3e;border-radius:12px;background:#1a1f2e"><h3 style="font-size:18px;font-weight:600;color:#fff;margin-bottom:8px">Feature Two</h3><p style="color:#9ca3af;font-size:14px">Brief description of the feature.</p></div><div style="padding:32px;border:1px solid #2a2f3e;border-radius:12px;background:#1a1f2e"><h3 style="font-size:18px;font-weight:600;color:#fff;margin-bottom:8px">Feature Three</h3><p style="color:#9ca3af;font-size:14px">Brief description of the feature.</p></div></div></section>' },
  { id: 'ept-pricing', label: 'Pricing Table', category: 'Sections', content: '<section style="padding:80px 24px;background:#0a0f1c"><h2 style="text-align:center;font-size:32px;font-weight:700;color:#fff;margin-bottom:48px">Pricing</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:960px;margin:0 auto"><div style="padding:32px;border:1px solid #2a2f3e;border-radius:16px;background:#1a1f2e;text-align:center"><h3 style="color:#C9A94E;font-size:14px;font-weight:600;text-transform:uppercase;margin-bottom:16px">Basic</h3><p style="font-size:42px;font-weight:800;color:#fff;margin-bottom:24px">$19<span style="font-size:16px;color:#9ca3af">/mo</span></p><ul style="list-style:none;padding:0;margin-bottom:32px;color:#9ca3af;font-size:14px;line-height:2.2"><li>5 Projects</li><li>10 GB Storage</li><li>Email Support</li></ul><a href="#" style="display:block;padding:12px;background:#2a2f3e;color:#fff;border-radius:10px;text-decoration:none;font-weight:600">Choose Plan</a></div><div style="padding:32px;border:2px solid #C9A94E;border-radius:16px;background:#1a1f2e;text-align:center;position:relative"><div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);padding:4px 16px;background:#C9A94E;color:#fff;border-radius:20px;font-size:11px;font-weight:700">POPULAR</div><h3 style="color:#C9A94E;font-size:14px;font-weight:600;text-transform:uppercase;margin-bottom:16px">Pro</h3><p style="font-size:42px;font-weight:800;color:#fff;margin-bottom:24px">$49<span style="font-size:16px;color:#9ca3af">/mo</span></p><ul style="list-style:none;padding:0;margin-bottom:32px;color:#9ca3af;font-size:14px;line-height:2.2"><li>Unlimited Projects</li><li>100 GB Storage</li><li>Priority Support</li></ul><a href="#" style="display:block;padding:12px;background:#C9A94E;color:#fff;border-radius:10px;text-decoration:none;font-weight:600">Choose Plan</a></div><div style="padding:32px;border:1px solid #2a2f3e;border-radius:16px;background:#1a1f2e;text-align:center"><h3 style="color:#C9A94E;font-size:14px;font-weight:600;text-transform:uppercase;margin-bottom:16px">Enterprise</h3><p style="font-size:42px;font-weight:800;color:#fff;margin-bottom:24px">$99<span style="font-size:16px;color:#9ca3af">/mo</span></p><ul style="list-style:none;padding:0;margin-bottom:32px;color:#9ca3af;font-size:14px;line-height:2.2"><li>Everything in Pro</li><li>1 TB Storage</li><li>24/7 Phone Support</li></ul><a href="#" style="display:block;padding:12px;background:#2a2f3e;color:#fff;border-radius:10px;text-decoration:none;font-weight:600">Choose Plan</a></div></div></section>' },
  { id: 'ept-cta', label: 'Call to Action', category: 'Sections', content: '<section style="padding:80px 24px;text-align:center;background:#C9A94E"><h2 style="font-size:36px;font-weight:700;color:#fff;margin-bottom:16px">Ready to Get Started?</h2><p style="font-size:16px;color:rgba(255,255,255,0.85);max-width:500px;margin:0 auto 32px">Take the next step. Contact us today.</p><a href="#" style="display:inline-block;padding:14px 36px;background:#fff;color:#0f1219;border-radius:12px;font-weight:600;text-decoration:none">Contact Us</a></section>' },
  { id: 'ept-testimonials', label: 'Testimonials', category: 'Sections', content: '<section style="padding:80px 24px;background:#0f1219"><h2 style="text-align:center;font-size:32px;font-weight:700;color:#fff;margin-bottom:48px">What Our Clients Say</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:960px;margin:0 auto"><div style="padding:24px;border:1px solid #2a2f3e;border-radius:12px;background:#1a1f2e"><p style="color:#9ca3af;font-size:14px;line-height:1.6;margin-bottom:16px">&ldquo;Exceptional service and results. Highly recommend to anyone looking for quality.&rdquo;</p><p style="color:#C9A94E;font-size:13px;font-weight:600">&mdash; Sarah Johnson</p></div><div style="padding:24px;border:1px solid #2a2f3e;border-radius:12px;background:#1a1f2e"><p style="color:#9ca3af;font-size:14px;line-height:1.6;margin-bottom:16px">&ldquo;Professional, responsive, and delivered beyond expectations. A true partner.&rdquo;</p><p style="color:#C9A94E;font-size:13px;font-weight:600">&mdash; Mike Thompson</p></div><div style="padding:24px;border:1px solid #2a2f3e;border-radius:12px;background:#1a1f2e"><p style="color:#9ca3af;font-size:14px;line-height:1.6;margin-bottom:16px">&ldquo;Game-changing results. Our business has grown 200% since working together.&rdquo;</p><p style="color:#C9A94E;font-size:13px;font-weight:600">&mdash; Lisa Chen</p></div></div></section>' },
  { id: 'ept-contact', label: 'Contact Form', category: 'Sections', content: '<section style="padding:80px 24px;max-width:600px;margin:0 auto"><h2 style="font-size:32px;font-weight:700;text-align:center;color:#fff;margin-bottom:32px">Get in Touch</h2><form style="display:flex;flex-direction:column;gap:16px"><input type="text" placeholder="Full Name" style="padding:14px 16px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:8px;color:#fff;font-size:14px" /><input type="email" placeholder="Email Address" style="padding:14px 16px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:8px;color:#fff;font-size:14px" /><input type="tel" placeholder="Phone Number" style="padding:14px 16px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:8px;color:#fff;font-size:14px" /><textarea placeholder="Your Message" rows="4" style="padding:14px 16px;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:8px;color:#fff;font-size:14px;resize:vertical"></textarea><button type="submit" style="padding:14px;background:#C9A94E;color:#fff;border:none;border-radius:10px;font-weight:600;font-size:16px;cursor:pointer">Send Message</button></form></section>' },
  { id: 'ept-footer', label: 'Footer', category: 'Sections', content: '<footer style="padding:48px 32px;background:#0a0e17;border-top:1px solid #1e2536"><div style="max-width:960px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:32px"><div><h4 style="color:#fff;font-weight:700;margin-bottom:12px">Company</h4><a href="#" style="display:block;color:#6b7280;text-decoration:none;font-size:13px;margin-bottom:8px">About</a><a href="#" style="display:block;color:#6b7280;text-decoration:none;font-size:13px;margin-bottom:8px">Careers</a><a href="#" style="display:block;color:#6b7280;text-decoration:none;font-size:13px">Press</a></div><div><h4 style="color:#fff;font-weight:700;margin-bottom:12px">Services</h4><a href="#" style="display:block;color:#6b7280;text-decoration:none;font-size:13px;margin-bottom:8px">Service 1</a><a href="#" style="display:block;color:#6b7280;text-decoration:none;font-size:13px;margin-bottom:8px">Service 2</a><a href="#" style="display:block;color:#6b7280;text-decoration:none;font-size:13px">Service 3</a></div><div><h4 style="color:#fff;font-weight:700;margin-bottom:12px">Support</h4><a href="#" style="display:block;color:#6b7280;text-decoration:none;font-size:13px;margin-bottom:8px">Help Center</a><a href="#" style="display:block;color:#6b7280;text-decoration:none;font-size:13px;margin-bottom:8px">Contact</a><a href="#" style="display:block;color:#6b7280;text-decoration:none;font-size:13px">Privacy</a></div><div><h4 style="color:#fff;font-weight:700;margin-bottom:12px">Connect</h4><p style="color:#6b7280;font-size:13px">info@company.com</p><p style="color:#6b7280;font-size:13px">(555) 123-4567</p></div></div><p style="text-align:center;color:#6b7280;font-size:12px;margin-top:32px">&copy; 2026 Company Name. All rights reserved.</p></footer>' },
  { id: 'ept-team', label: 'Team Section', category: 'Sections', content: '<section style="padding:80px 24px;background:#0f1219"><h2 style="text-align:center;font-size:32px;font-weight:700;color:#fff;margin-bottom:48px">Our Team</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:960px;margin:0 auto"><div style="text-align:center;padding:32px;border:1px solid #2a2f3e;border-radius:12px;background:#1a1f2e"><div style="width:80px;height:80px;border-radius:50%;background:#C9A94E;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff">JD</div><h3 style="color:#fff;font-size:16px;font-weight:600">John Doe</h3><p style="color:#C9A94E;font-size:13px">CEO & Founder</p></div><div style="text-align:center;padding:32px;border:1px solid #2a2f3e;border-radius:12px;background:#1a1f2e"><div style="width:80px;height:80px;border-radius:50%;background:#7c3aed;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff">JS</div><h3 style="color:#fff;font-size:16px;font-weight:600">Jane Smith</h3><p style="color:#C9A94E;font-size:13px">CTO</p></div><div style="text-align:center;padding:32px;border:1px solid #2a2f3e;border-radius:12px;background:#1a1f2e"><div style="width:80px;height:80px;border-radius:50%;background:#059669;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff">BJ</div><h3 style="color:#fff;font-size:16px;font-weight:600">Bob Johnson</h3><p style="color:#C9A94E;font-size:13px">Lead Developer</p></div></div></section>' },
  { id: 'ept-faq', label: 'FAQ', category: 'Sections', content: '<section style="padding:80px 24px;max-width:700px;margin:0 auto"><h2 style="text-align:center;font-size:32px;font-weight:700;color:#fff;margin-bottom:48px">Frequently Asked Questions</h2><div style="display:flex;flex-direction:column;gap:12px"><div style="padding:20px;border:1px solid #2a2f3e;border-radius:10px;background:#1a1f2e"><h3 style="color:#fff;font-size:15px;font-weight:600;margin-bottom:8px">How does it work?</h3><p style="color:#9ca3af;font-size:14px;line-height:1.6">Simply sign up, choose your plan, and get started in minutes. Our team is here to help every step of the way.</p></div><div style="padding:20px;border:1px solid #2a2f3e;border-radius:10px;background:#1a1f2e"><h3 style="color:#fff;font-size:15px;font-weight:600;margin-bottom:8px">What is your refund policy?</h3><p style="color:#9ca3af;font-size:14px;line-height:1.6">We offer a full 30-day money-back guarantee. No questions asked.</p></div><div style="padding:20px;border:1px solid #2a2f3e;border-radius:10px;background:#1a1f2e"><h3 style="color:#fff;font-size:15px;font-weight:600;margin-bottom:8px">Do you offer support?</h3><p style="color:#9ca3af;font-size:14px;line-height:1.6">Yes! We provide email support on all plans and priority phone support on Pro and Enterprise.</p></div></div></section>' },
  { id: 'ept-stats', label: 'Stats Bar', category: 'Sections', content: '<section style="padding:48px 24px;background:#1a1f2e;border-top:1px solid #2a2f3e;border-bottom:1px solid #2a2f3e"><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;max-width:960px;margin:0 auto;text-align:center"><div><p style="font-size:36px;font-weight:800;color:#C9A94E;margin-bottom:4px">500+</p><p style="color:#9ca3af;font-size:13px">Happy Clients</p></div><div><p style="font-size:36px;font-weight:800;color:#C9A94E;margin-bottom:4px">98%</p><p style="color:#9ca3af;font-size:13px">Satisfaction Rate</p></div><div><p style="font-size:36px;font-weight:800;color:#C9A94E;margin-bottom:4px">15+</p><p style="color:#9ca3af;font-size:13px">Years Experience</p></div><div><p style="font-size:36px;font-weight:800;color:#C9A94E;margin-bottom:4px">24/7</p><p style="color:#9ca3af;font-size:13px">Support Available</p></div></div></section>' },
  { id: 'ept-gallery', label: 'Image Gallery', category: 'Sections', content: '<section style="padding:80px 24px"><h2 style="text-align:center;font-size:32px;font-weight:700;color:#fff;margin-bottom:48px">Gallery</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:960px;margin:0 auto"><div style="height:200px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px"></div><div style="height:200px;background:linear-gradient(135deg,#f093fb,#f5576c);border-radius:12px"></div><div style="height:200px;background:linear-gradient(135deg,#4facfe,#00f2fe);border-radius:12px"></div><div style="height:200px;background:linear-gradient(135deg,#43e97b,#38f9d7);border-radius:12px"></div><div style="height:200px;background:linear-gradient(135deg,#fa709a,#fee140);border-radius:12px"></div><div style="height:200px;background:linear-gradient(135deg,#a18cd1,#fbc2eb);border-radius:12px"></div></div></section>' },
  { id: 'ept-newsletter', label: 'Newsletter', category: 'Sections', content: '<section style="padding:64px 24px;background:#1a1f2e;text-align:center"><h2 style="font-size:28px;font-weight:700;color:#fff;margin-bottom:8px">Stay Updated</h2><p style="color:#9ca3af;font-size:14px;margin-bottom:24px">Subscribe to our newsletter for the latest news and offers.</p><form style="display:flex;gap:12px;max-width:480px;margin:0 auto"><input type="email" placeholder="Enter your email" style="flex:1;padding:14px 16px;background:#0f1219;border:1px solid #2a2f3e;border-radius:8px;color:#fff;font-size:14px" /><button type="submit" style="padding:14px 28px;background:#C9A94E;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer">Subscribe</button></form></section>' },
  { id: 'ept-video', label: 'Video Section', category: 'Sections', content: '<section style="padding:80px 24px;text-align:center"><h2 style="font-size:32px;font-weight:700;color:#fff;margin-bottom:32px">See It in Action</h2><div style="max-width:720px;margin:0 auto;aspect-ratio:16/9;background:#1a1f2e;border:1px solid #2a2f3e;border-radius:16px;display:flex;align-items:center;justify-content:center"><div style="width:64px;height:64px;border-radius:50%;background:#C9A94E;display:flex;align-items:center;justify-content:center;cursor:pointer"><span style="color:#fff;font-size:24px;margin-left:4px">&#9654;</span></div></div></section>' },
  { id: 'ept-logos', label: 'Logo Bar', category: 'Sections', content: '<section style="padding:48px 24px;text-align:center"><p style="color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin-bottom:24px">Trusted by leading companies</p><div style="display:flex;align-items:center;justify-content:center;gap:48px;flex-wrap:wrap;opacity:0.5"><span style="font-size:24px;font-weight:800;color:#9ca3af">Company A</span><span style="font-size:24px;font-weight:800;color:#9ca3af">Company B</span><span style="font-size:24px;font-weight:800;color:#9ca3af">Company C</span><span style="font-size:24px;font-weight:800;color:#9ca3af">Company D</span><span style="font-size:24px;font-weight:800;color:#9ca3af">Company E</span></div></section>' },
  { id: 'ept-how-it-works', label: 'How It Works', category: 'Sections', content: '<section style="padding:80px 24px"><h2 style="text-align:center;font-size:32px;font-weight:700;color:#fff;margin-bottom:48px">How It Works</h2><div style="display:flex;gap:32px;max-width:960px;margin:0 auto;justify-content:center"><div style="flex:1;text-align:center;max-width:240px"><div style="width:56px;height:56px;border-radius:50%;background:#C9A94E;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#fff">1</div><h3 style="color:#fff;font-size:16px;font-weight:600;margin-bottom:8px">Sign Up</h3><p style="color:#9ca3af;font-size:13px">Create your account in seconds.</p></div><div style="flex:1;text-align:center;max-width:240px"><div style="width:56px;height:56px;border-radius:50%;background:#C9A94E;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#fff">2</div><h3 style="color:#fff;font-size:16px;font-weight:600;margin-bottom:8px">Customize</h3><p style="color:#9ca3af;font-size:13px">Configure your preferences.</p></div><div style="flex:1;text-align:center;max-width:240px"><div style="width:56px;height:56px;border-radius:50%;background:#C9A94E;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#fff">3</div><h3 style="color:#fff;font-size:16px;font-weight:600;margin-bottom:8px">Launch</h3><p style="color:#9ca3af;font-size:13px">Go live and start growing.</p></div></div></section>' },
  { id: 'ept-divider', label: 'Divider', category: 'Basic', content: '<div style="padding:0 24px"><hr style="border:none;border-top:1px solid #2a2f3e;margin:32px auto;max-width:960px" /></div>' },
  { id: 'ept-spacer', label: 'Spacer', category: 'Basic', content: '<div style="height:64px"></div>' },
];

/* ─── GrapeJS dark theme CSS injection ─── */
const GRAPE_DARK_CSS = `
.gjs-one-bg{background-color:#0f1219!important}.gjs-two-color{color:#d4d4d8!important}
.gjs-three-bg{background-color:#1a1f2e!important}.gjs-four-color,.gjs-four-color-h:hover{color:#C9A94E!important}
.gjs-block{padding:8px!important;border:1px solid #2a2f3e!important;border-radius:8px!important;background:#1a1f2e!important;color:#9ca3af!important;min-height:auto!important}
.gjs-block:hover{border-color:#C9A94E!important;color:#e2e8f0!important}
.gjs-block svg{fill:#9ca3af!important}.gjs-block:hover svg{fill:#C9A94E!important}
.gjs-layer,.gjs-layer-name{color:#d4d4d8!important}.gjs-layer:hover{background:#1a1f2e!important}
.gjs-layers{background:#0f1219!important}
.gjs-field,.gjs-field input,.gjs-field select,.gjs-field textarea{background:#1a1f2e!important;color:#d4d4d8!important;border-color:#2a2f3e!important;border-radius:4px!important}
.gjs-radio-item label{color:#9ca3af!important}.gjs-radio-item input:checked+label{color:#C9A94E!important}
.gjs-sm-sector .gjs-sm-sector-title{background:#1a1f2e!important;color:#C9A94E!important;border-color:#2a2f3e!important;font-weight:600!important}
.gjs-sm-property{color:#d4d4d8!important}.gjs-sm-label{color:#9ca3af!important}
.gjs-trt-trait{padding:6px 8px!important}.gjs-trt-trait .gjs-label{color:#9ca3af!important}
.gjs-clm-tags .gjs-sm-composite{background:#1a1f2e!important}
.gjs-category-title{background:#0f1219!important;border-color:#2a2f3e!important;color:#C9A94E!important;font-weight:600!important}
.gjs-layer.gjs-selected .gjs-layer-title{background:rgba(201,169,78,0.15)!important}
`;

/* ─── AI generation via echo-chat ─── */
const ECHO_CHAT_URL = 'https://echo-chat.bmcii1976.workers.dev';
const ECHO_API_KEY = 'echo-omega-prime-forge-x-2026';

async function generateWebsiteHTML(prompt: string): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(ECHO_CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Echo-API-Key': ECHO_API_KEY },
      body: JSON.stringify({
        message: `Generate a complete, production-ready HTML website for: "${prompt}". Return ONLY raw HTML with inline CSS. Use a dark theme (#0f1219 bg, #1a1f2e cards, #C9A94E accent). Include: navigation, hero, features/services, testimonials, CTA, and footer. Make it responsive. No markdown, no code fences, no explanation — just the HTML.`,
        personality: 'nexus',
        site_id: 'echo-ept',
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const raw = data.response || data.message || data.content || '';
    const fenced = raw.match(/```(?:html)?\s*([\s\S]*?)```/);
    const html = fenced ? fenced[1].trim() : raw.trim();
    if (html.length < 50) throw new Error('Response too short');
    return html;
  } catch {
    clearTimeout(timer);
    return TEMPLATE_HTML['saas'] || '<h1>Generated Website</h1>';
  }
}

/* ─── Project persistence ─── */
const PROJECT_STORAGE_KEY = 'echo-builder-project';

interface ProjectData {
  pages: BuilderPage[];
  activePageId: string;
  settings: SiteSettings;
  savedAt: string;
}

function loadProject(): ProjectData | null {
  try {
    const raw = localStorage.getItem(PROJECT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveProject(data: ProjectData) {
  try {
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({ ...data, savedAt: new Date().toISOString() }));
  } catch { /* storage full */ }
}

const DEFAULT_SETTINGS: SiteSettings = {
  title: 'My Website',
  description: '',
  favicon: '',
  colorTheme: COLOR_THEMES[0],
  fontPairing: FONT_PAIRINGS[0],
  borderRadius: 'md',
};

const DEFAULT_PAGES: BuilderPage[] = [
  { id: 'home', name: 'Home', slug: '/', html: '', isHome: true },
];

/* ─── Main Builder Component ─── */
function BuilderInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading } = useAuth();

  // GrapeJS
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);

  // Left sidebar
  const [sidebarTab, setSidebarTab] = useState('templates');

  // Right panel (GrapeJS managers)
  const [activePanel, setActivePanel] = useState<'blocks' | 'layers' | 'style' | 'traits'>('blocks');

  // AI generation
  const [aiGenerating, setAiGenerating] = useState(false);

  // Multi-page
  const [pages, setPages] = useState<BuilderPage[]>(DEFAULT_PAGES);
  const [activePageId, setActivePageId] = useState('home');

  // Site settings
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  // Code editor toggle
  const [showCode, setShowCode] = useState(false);
  const [codeValue, setCodeValue] = useState('');

  // Save indicator
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Publish modal
  const [showPublish, setShowPublish] = useState(false);

  // Cloud publishing
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'done' | 'error'>('idle');
  const [publishUrl, setPublishUrl] = useState<string | null>(null);
  const [customDomain, setCustomDomain] = useState('');

  // Get current page HTML from editor
  const getCurrentHtml = useCallback(() => {
    if (!editorRef.current) return '';
    return editorRef.current.getHtml() || '';
  }, []);

  const getCurrentCss = useCallback(() => {
    if (!editorRef.current) return '';
    return editorRef.current.getCss() || '';
  }, []);

  // Save current page HTML to pages state
  const saveCurrentPageToState = useCallback(() => {
    if (!editorRef.current) return;
    const html = getCurrentHtml();
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, html } : p));
  }, [activePageId, getCurrentHtml]);

  // Load page HTML into editor
  const loadPageIntoEditor = useCallback((pageId: string) => {
    if (!editorRef.current) return;
    const page = pages.find(p => p.id === pageId);
    if (page) {
      editorRef.current.setComponents(page.html || '');
    }
  }, [pages]);

  // Switch active page
  const handleSelectPage = useCallback((pageId: string) => {
    saveCurrentPageToState();
    setActivePageId(pageId);
    const page = pages.find(p => p.id === pageId);
    if (page && editorRef.current) {
      editorRef.current.setComponents(page.html || '');
    }
  }, [pages, saveCurrentPageToState]);

  // Add new page
  const handleAddPage = useCallback(() => {
    saveCurrentPageToState();
    const id = `page-${Date.now()}`;
    const newPage: BuilderPage = { id, name: `Page ${pages.length + 1}`, slug: `/page-${pages.length + 1}`, html: '', isHome: false };
    setPages(prev => [...prev, newPage]);
    setActivePageId(id);
    if (editorRef.current) editorRef.current.setComponents('');
  }, [pages.length, saveCurrentPageToState]);

  // Delete page
  const handleDeletePage = useCallback((pageId: string) => {
    if (pages.length <= 1) return;
    const remaining = pages.filter(p => p.id !== pageId);
    setPages(remaining);
    if (activePageId === pageId) {
      const newActive = remaining[0].id;
      setActivePageId(newActive);
      if (editorRef.current) {
        editorRef.current.setComponents(remaining[0].html || '');
      }
    }
  }, [pages, activePageId]);

  // Rename page
  const handleRenamePage = useCallback((pageId: string, name: string) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, name, slug: `/${name.toLowerCase().replace(/\s+/g, '-')}` } : p));
  }, []);

  // Update settings
  const handleUpdateSettings = useCallback((partial: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  // Save project
  const handleSaveProject = useCallback(() => {
    saveCurrentPageToState();
    // Use timeout to let state update
    setTimeout(() => {
      setPages(currentPages => {
        const data: ProjectData = { pages: currentPages, activePageId, settings, savedAt: new Date().toISOString() };
        saveProject(data);
        setLastSaved(new Date().toLocaleTimeString());
        return currentPages;
      });
    }, 50);
  }, [activePageId, settings, saveCurrentPageToState]);

  // Apply AI-generated HTML
  const handleApplyHtml = useCallback((html: string) => {
    if (!editorRef.current) {
      alert('Editor is still loading. Please wait a moment and try again.');
      return;
    }
    // Extract clean HTML from AI response (may contain markdown code fences)
    let cleanHtml = html;
    const codeBlockMatch = html.match(/```html\s*([\s\S]*?)```/);
    if (codeBlockMatch) cleanHtml = codeBlockMatch[1].trim();
    // Parse full HTML documents — extract body + CSS
    let bodyContent = cleanHtml;
    let css = '';
    if (cleanHtml.includes('<!DOCTYPE') || cleanHtml.includes('<html')) {
      const styleMatch = cleanHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
      if (styleMatch) css = styleMatch.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');
      const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) bodyContent = bodyMatch[1];
      else bodyContent = cleanHtml.replace(/<!DOCTYPE[^>]*>/i, '').replace(/<\/?html[^>]*>/gi, '').replace(/<head>[\s\S]*?<\/head>/i, '').replace(/<\/?body[^>]*>/gi, '');
    }
    editorRef.current.setComponents(bodyContent);
    if (css) editorRef.current.setStyle(css);
  }, []);

  // Insert section from SectionBrowser
  const handleInsertSection = useCallback((html: string) => {
    if (!editorRef.current || !editorReady) {
      alert('Editor is still loading. Please wait a moment and try again.');
      return;
    }
    const wrapper = editorRef.current.getWrapper();
    if (wrapper) wrapper.append(html);
  }, [editorReady]);

  // Load a template (from gallery or TEMPLATE_HTML)
  // Templates from TEMPLATE_CATALOG are full HTML documents — strip to body content + CSS
  const handleSelectTemplate = useCallback((html: string) => {
    if (!editorRef.current) {
      alert('Editor is still loading. Please wait a moment and try again.');
      return;
    }
    let bodyContent = html;
    let css = '';
    // Check if this is a full HTML document
    if (html.includes('<!DOCTYPE') || html.includes('<html')) {
      // Extract all <style> blocks
      const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
      if (styleMatches) {
        css = styleMatches.map(s => {
          const inner = s.replace(/<style[^>]*>/i, '').replace(/<\/style>/i, '');
          return inner.trim();
        }).join('\n');
      }
      // Extract body content
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        bodyContent = bodyMatch[1].trim();
      } else {
        // No <body> tag — strip everything before first visible element
        bodyContent = html
          .replace(/<!DOCTYPE[^>]*>/i, '')
          .replace(/<html[^>]*>/i, '')
          .replace(/<\/html>/i, '')
          .replace(/<head>[\s\S]*?<\/head>/i, '')
          .replace(/<body[^>]*>/i, '')
          .replace(/<\/body>/i, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .trim();
      }
    } else {
      // Fragment — check for inline <style> blocks
      const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
      if (styleMatch) {
        css = styleMatch.map(s => s.replace(/<style[^>]*>/i, '').replace(/<\/style>/i, '').trim()).join('\n');
        bodyContent = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').trim();
      }
    }
    editorRef.current.setComponents(bodyContent);
    if (css) editorRef.current.setStyle(css);
  }, []);

  // Code editor toggle
  const handleToggleCode = useCallback(() => {
    if (!showCode) {
      // Opening code editor — grab current HTML
      const html = getCurrentHtml();
      const css = getCurrentCss();
      setCodeValue(`<style>\n${css}\n</style>\n\n${html}`);
    } else {
      // Closing code editor — apply edits back
      if (editorRef.current && codeValue.trim()) {
        // Extract style and HTML
        const styleMatch = codeValue.match(/<style>([\s\S]*?)<\/style>/);
        const css = styleMatch ? styleMatch[1].trim() : '';
        const html = codeValue.replace(/<style>[\s\S]*?<\/style>/g, '').trim();
        editorRef.current.setComponents(html);
        if (css) editorRef.current.setStyle(css);
      }
    }
    setShowCode(!showCode);
  }, [showCode, codeValue, getCurrentHtml, getCurrentCss]);

  // Publish handler
  const handlePublish = useCallback(() => {
    setShowPublish(true);
    setPublishStatus('idle');
    setPublishUrl(null);
  }, []);

  // Insert image onto canvas from asset manager
  const handleInsertImage = useCallback((src: string) => {
    if (!editorRef.current) {
      alert('Editor is still loading. Please wait a moment and try again.');
      return;
    }
    const wrapper = editorRef.current.getWrapper();
    wrapper.append(`<img src="${src}" alt="Uploaded image" style="max-width:100%;height:auto;display:block;margin:16px auto" />`);
  }, []);

  // Publish to Echo Cloud (Cloudflare Worker)
  const handlePublishToCloud = useCallback(async () => {
    setPublishStatus('publishing');
    try {
      saveCurrentPageToState();
      // Small delay for state to flush
      await new Promise(r => setTimeout(r, 100));
      const html = getCurrentHtml();
      const css = getCurrentCss();

      // Build full site HTML with all pages
      const allPages = pages.map(p => p.id === activePageId ? { ...p, html } : p);
      const pageHtmls = allPages.map(p => {
        const pageNav = allPages.length > 1
          ? `<nav style="display:flex;gap:16px;padding:12px 24px;background:#0f1219;border-bottom:1px solid #2a2f3e">${allPages.map(np => `<a href="/${np.isHome ? '' : np.slug.replace(/^\//, '')}" style="color:${np.id === p.id ? '#C9A94E' : '#9ca3af'};text-decoration:none;font-size:14px">${np.name}</a>`).join('')}</nav>`
          : '';
        return {
          slug: p.isHome ? '/' : p.slug,
          html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${p.name} - ${settings.title}</title><meta name="description" content="${settings.description}"><style>${css}</style></head><body>${pageNav}${p.html}</body></html>`,
        };
      });

      const siteId = `site-${user?.uid?.slice(0, 8) || 'anon'}-${Date.now().toString(36)}`;
      const domain = customDomain.trim() || `${siteId}.echo-sites.workers.dev`;

      // Publish via echo-website-publisher Worker
      const resp = await fetch('https://echo-website-publisher.bmcii1976.workers.dev/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          title: settings.title,
          description: settings.description,
          pages: pageHtmls,
          customDomain: customDomain.trim() || undefined,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setPublishUrl(data.url || `https://${domain}`);
        setPublishStatus('done');
      } else {
        // Fallback — generate a data URI preview instead
        const indexPage = pageHtmls.find(p => p.slug === '/') || pageHtmls[0];
        const blob = new Blob([indexPage.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setPublishStatus('idle');
        setShowPublish(false);
      }
    } catch {
      setPublishStatus('error');
    }
  }, [pages, activePageId, settings, customDomain, user, getCurrentHtml, getCurrentCss, saveCurrentPageToState]);

  // Export all pages as ZIP-like download
  const handleExportAll = useCallback(() => {
    saveCurrentPageToState();
    setTimeout(() => {
      setPages(currentPages => {
        const css = getCurrentCss();
        const filesHtml = currentPages.map(p => {
          const filename = p.isHome ? 'index.html' : `${p.slug.replace(/^\//, '') || p.id}.html`;
          const pageNav = currentPages.length > 1
            ? `<nav style="display:flex;gap:16px;padding:12px 24px;background:#0f1219;border-bottom:1px solid #2a2f3e">${currentPages.map(np => `<a href="${np.isHome ? 'index.html' : (np.slug.replace(/^\//, '') || np.id) + '.html'}" style="color:${np.id === p.id ? '#C9A94E' : '#9ca3af'};text-decoration:none;font-size:14px">${np.name}</a>`).join('')}</nav>`
            : '';
          return {
            name: filename,
            content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1.0">\n<title>${p.name} - ${settings.title}</title>\n<meta name="description" content="${settings.description}">\n<style>\n${css}\n</style>\n</head>\n<body>\n${pageNav}\n${p.html}\n</body>\n</html>`,
          };
        });

        if (filesHtml.length === 1) {
          const blob = new Blob([filesHtml[0].content], { type: 'text/html' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = filesHtml[0].name;
          a.click();
          URL.revokeObjectURL(a.href);
        } else {
          // Multi-page: download each file
          filesHtml.forEach(f => {
            const blob = new Blob([f.content], { type: 'text/html' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = f.name;
            a.click();
            URL.revokeObjectURL(a.href);
          });
        }
        return currentPages;
      });
    }, 50);
  }, [getCurrentCss, saveCurrentPageToState, settings]);

  // ─── Initialize GrapeJS ───
  useEffect(() => {
    if (loading || !user) return;
    if (!containerRef.current) return;
    // If editor exists but its container is detached from DOM, destroy and re-init
    if (editorRef.current) {
      try {
        const el = editorRef.current.getContainer?.();
        if (el && el.isConnected) return; // editor is fine, skip
      } catch { /* proceed to re-init */ }
      try { editorRef.current.destroy(); } catch { /* ignore */ }
      editorRef.current = null;
      setEditorReady(false);
    }

    let autoSaveTimer: ReturnType<typeof setInterval> | null = null;

    const loadGrapeJS = async () => {
      // Load GrapeJS CSS + JS
      if (!document.getElementById('grapesjs-css')) {
        const link = document.createElement('link');
        link.id = 'grapesjs-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/grapesjs@0.21.13/dist/css/grapes.min.css';
        document.head.appendChild(link);
      }

      const loadScript = (src: string) => new Promise<void>((res, rej) => {
        if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => res();
        s.onerror = rej;
        document.head.appendChild(s);
      });

      await loadScript('https://unpkg.com/grapesjs@0.21.13/dist/grapes.min.js');
      await loadScript('https://unpkg.com/grapesjs-blocks-basic@1.0.2/dist/index.min.js');

      const grapesjs = (window as any).grapesjs;
      if (!grapesjs || !containerRef.current) return;

      // Inject dark theme
      const styleEl = document.createElement('style');
      styleEl.textContent = GRAPE_DARK_CSS;
      document.head.appendChild(styleEl);

      const editor = grapesjs.init({
        container: containerRef.current,
        height: '100%',
        width: 'auto',
        storageManager: false, // We handle persistence ourselves
        deviceManager: {
          devices: [
            { name: 'Desktop', width: '' },
            { name: 'Tablet', width: '768px', widthMedia: '992px' },
            { name: 'Mobile', width: '375px', widthMedia: '480px' },
          ],
        },
        blockManager: { appendTo: '#blocks-panel' },
        layerManager: { appendTo: '#layers-panel' },
        styleManager: {
          appendTo: '#styles-panel',
          sectors: [
            { name: 'General', open: true, properties: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'] },
            { name: 'Dimension', open: false, properties: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'] },
            { name: 'Typography', open: false, properties: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'] },
            { name: 'Decorations', open: false, properties: ['opacity', 'border-radius', 'border', 'box-shadow', 'background', 'background-color'] },
            { name: 'Extra', open: false, properties: ['transition', 'perspective', 'transform'] },
          ],
        },
        traitManager: { appendTo: '#traits-panel' },
        panels: { defaults: [] },
        plugins: ['gjs-blocks-basic'],
        pluginsOpts: { 'gjs-blocks-basic': { flexGrid: true } },
      });

      // Register custom blocks
      const bm = editor.BlockManager;
      EPT_BLOCKS.forEach(b => bm.add(b.id, { label: b.label, category: b.category, content: b.content, attributes: { class: 'gjs-block-section' } }));

      // Add a contact form block
      bm.add('contact-form', {
        label: 'Contact Form',
        category: 'Forms',
        content: `<form action="" method="POST" style="max-width:480px;margin:24px auto;display:flex;flex-direction:column;gap:12px">
          <input type="text" name="name" placeholder="Your Name" required style="padding:12px;border-radius:8px;border:1px solid #2a2f3e;background:#1a1f2e;color:#e2e8f0;font-size:14px" />
          <input type="email" name="email" placeholder="Email Address" required style="padding:12px;border-radius:8px;border:1px solid #2a2f3e;background:#1a1f2e;color:#e2e8f0;font-size:14px" />
          <textarea name="message" placeholder="Your Message" rows="4" style="padding:12px;border-radius:8px;border:1px solid #2a2f3e;background:#1a1f2e;color:#e2e8f0;font-size:14px;resize:vertical"></textarea>
          <button type="submit" style="padding:14px 24px;border-radius:8px;border:none;background:#C9A94E;color:#fff;font-size:14px;font-weight:600;cursor:pointer">Send Message</button>
        </form>`,
        attributes: { class: 'gjs-block-section' },
      });
      bm.add('newsletter-form', {
        label: 'Newsletter Signup',
        category: 'Forms',
        content: `<form action="" method="POST" style="max-width:480px;margin:24px auto;display:flex;gap:8px">
          <input type="email" name="email" placeholder="Enter your email" required style="flex:1;padding:12px;border-radius:8px;border:1px solid #2a2f3e;background:#1a1f2e;color:#e2e8f0;font-size:14px" />
          <button type="submit" style="padding:12px 24px;border-radius:8px;border:none;background:#C9A94E;color:#fff;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap">Subscribe</button>
        </form>`,
        attributes: { class: 'gjs-block-section' },
      });

      // Register form traits so users can configure action/method/target
      editor.DomComponents.addType('form', {
        isComponent: (el: HTMLElement) => el.tagName === 'FORM',
        model: {
          defaults: {
            tagName: 'form',
            droppable: true,
            traits: [
              { type: 'text', name: 'action', label: 'Form Action URL', placeholder: 'https://api.example.com/submit' },
              { type: 'select', name: 'method', label: 'Method', options: [{ value: 'POST', name: 'POST' }, { value: 'GET', name: 'GET' }] },
              { type: 'select', name: 'target', label: 'Target', options: [{ value: '_self', name: 'Same Window' }, { value: '_blank', name: 'New Tab' }] },
            ],
          },
        },
      });
      editor.DomComponents.addType('input', {
        isComponent: (el: HTMLElement) => el.tagName === 'INPUT',
        model: {
          defaults: {
            tagName: 'input',
            traits: [
              { type: 'text', name: 'name', label: 'Field Name' },
              { type: 'text', name: 'placeholder', label: 'Placeholder' },
              { type: 'select', name: 'type', label: 'Input Type', options: [
                { value: 'text', name: 'Text' }, { value: 'email', name: 'Email' }, { value: 'tel', name: 'Phone' },
                { value: 'number', name: 'Number' }, { value: 'url', name: 'URL' }, { value: 'password', name: 'Password' },
              ]},
              { type: 'checkbox', name: 'required', label: 'Required' },
            ],
          },
        },
      });
      editor.DomComponents.addType('textarea', {
        isComponent: (el: HTMLElement) => el.tagName === 'TEXTAREA',
        model: {
          defaults: {
            tagName: 'textarea',
            traits: [
              { type: 'text', name: 'name', label: 'Field Name' },
              { type: 'text', name: 'placeholder', label: 'Placeholder' },
              { type: 'number', name: 'rows', label: 'Rows' },
              { type: 'checkbox', name: 'required', label: 'Required' },
            ],
          },
        },
      });

      editorRef.current = editor;
      setEditorReady(true);
      setEditorError(null);

      // Enable image drop from AssetManager into GrapesJS canvas iframe
      editor.on('load', () => {
        try {
          const iframe = editor.Canvas?.getFrameEl?.();
          const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
          if (iframeDoc) {
            iframeDoc.addEventListener('dragover', (e: DragEvent) => { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'; });
            iframeDoc.addEventListener('drop', (e: DragEvent) => {
              e.preventDefault();
              const src = e.dataTransfer?.getData('text/plain');
              if (src && (src.startsWith('data:image') || src.startsWith('http'))) {
                const wrapper = editor.getWrapper();
                if (wrapper) wrapper.append(`<img src="${src}" alt="Dropped image" style="max-width:100%;height:auto;display:block;margin:16px auto" />`);
              }
            });
          }
        } catch (err) {
          console.warn('Could not attach iframe drop handler:', err);
        }
      });

      // Load saved project or template from URL params
      const saved = loadProject();
      const templateParam = params.get('template');

      if (saved) {
        setPages(saved.pages);
        setActivePageId(saved.activePageId);
        setSettings(saved.settings);
        const activePage = saved.pages.find(p => p.id === saved.activePageId);
        if (activePage?.html) editor.setComponents(activePage.html);
      } else if (templateParam && TEMPLATE_HTML[templateParam]) {
        editor.setComponents(TEMPLATE_HTML[templateParam]);
      }

      // Auto-save every 30 seconds
      autoSaveTimer = setInterval(() => {
        if (!editorRef.current) return;
        const html = editorRef.current.getHtml() || '';
        setPages(prev => {
          const updated = prev.map(p => p.id === activePageId ? { ...p, html } : p);
          saveProject({ pages: updated, activePageId, settings, savedAt: new Date().toISOString() });
          return updated;
        });
      }, 30000);
    };

    loadGrapeJS().catch(err => {
      console.error('GrapesJS failed to load:', err);
      setEditorError('Failed to load visual editor. Please refresh the page.');
    });

    return () => {
      if (autoSaveTimer) clearInterval(autoSaveTimer);
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050508' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#14b8a6', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0f1219', color: '#d4d4d8', overflow: 'hidden' }}>
      {/* ── TOP BAR ── */}
      <BuilderTopBar gjs={editorRef.current} onPublish={handlePublish} />

      {/* ── Save / Code toggle bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 16px', background: '#0a0e17', borderBottom: '1px solid #1a1f2e', flexShrink: 0, fontSize: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={handleSaveProject}
            style={{ padding: '4px 12px', borderRadius: 4, border: '1px solid #2a2f3e', background: '#1a1f2e', color: '#9ca3af', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
            Save Project
          </button>
          {lastSaved && <span style={{ color: '#6b7280', fontSize: 11 }}>Saved at {lastSaved}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={handleToggleCode}
            style={{ padding: '4px 12px', borderRadius: 4, border: `1px solid ${showCode ? '#7c3aed' : '#2a2f3e'}`, background: showCode ? '#7c3aed22' : 'transparent', color: showCode ? '#c4b5fd' : '#9ca3af', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
            {showCode ? 'Close Code Editor' : '<> Code'}
          </button>
          <button onClick={handleExportAll}
            style={{ padding: '4px 12px', borderRadius: 4, border: '1px solid #2a2f3e', background: 'transparent', color: '#9ca3af', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
            Export All Pages
          </button>
        </div>
      </div>

      {/* ── MAIN EDITOR LAYOUT ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar — 340px with tabs */}
        <BuilderSidebar activeTab={sidebarTab} onTabChange={setSidebarTab}>
          {sidebarTab === 'ai' && (
            <AskEchoPrime
              onApplyHtml={handleApplyHtml}
              currentHtml={editorReady ? getCurrentHtml() : undefined}
            />
          )}
          {sidebarTab === 'sections' && (
            <SectionBrowser onInsertSection={handleInsertSection} />
          )}
          {sidebarTab === 'templates' && (
            <div style={{ padding: '0 12px' }}>
              {/* Template catalog from component */}
              <TemplateGallery onSelectTemplate={handleSelectTemplate} />
              {/* Quick industry templates */}
              <div style={{ marginTop: 16, borderTop: '1px solid #2a2f3e', paddingTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#C9A94E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, padding: '0 4px' }}>Industry Templates</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {Object.keys(TEMPLATE_HTML).map(key => (
                    <button key={key} onClick={() => handleSelectTemplate(TEMPLATE_HTML[key])}
                      style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #2a2f3e', background: '#1a1f2e', color: '#9ca3af', cursor: 'pointer', fontSize: 12, textAlign: 'left', textTransform: 'capitalize' }}>
                      {key.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {sidebarTab === 'pages' && (
            <PagesPanel
              pages={pages}
              activePageId={activePageId}
              onSelectPage={handleSelectPage}
              onAddPage={handleAddPage}
              onDeletePage={handleDeletePage}
              onRenamePage={handleRenamePage}
            />
          )}
          {sidebarTab === 'assets' && (
            <AssetManager onInsertImage={handleInsertImage} editorRef={editorRef} />
          )}
          {sidebarTab === 'settings' && (
            <SettingsPanel settings={settings} onUpdateSettings={handleUpdateSettings} />
          )}
        </BuilderSidebar>

        {/* Center — Canvas AND Code Editor (both always mounted, toggled via CSS) */}
        <div ref={containerRef} style={{ flex: showCode ? 0 : 1, overflow: 'hidden', display: showCode ? 'none' : 'block', minHeight: 0 }} />
        {editorError && !showCode && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '24px 32px', background: '#1a1f2e', border: '1px solid #ef4444', borderRadius: 12, color: '#fca5a5', fontSize: 14, textAlign: 'center', zIndex: 10 }}>
            {editorError}
          </div>
        )}
        <div style={{ flex: showCode ? 1 : 0, display: showCode ? 'flex' : 'none', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          {/* Line numbers + syntax-highlighted code editor */}
          <div style={{ display: 'flex', flex: 1, overflow: 'auto', background: '#0a0e17' }}>
            {/* Line numbers gutter */}
            <div style={{
              padding: '16px 0', minWidth: 48, textAlign: 'right', userSelect: 'none',
              fontFamily: 'JetBrains Mono, Consolas, monospace', fontSize: 13, lineHeight: 1.6,
              color: '#4a5568', background: '#080c14', borderRight: '1px solid #1e293b',
              position: 'sticky', left: 0, zIndex: 1,
            }}>
              {codeValue.split('\n').map((_, i) => (
                <div key={i} style={{ paddingRight: 12 }}>{i + 1}</div>
              ))}
            </div>
            {/* Code textarea */}
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                value={codeValue}
                onChange={e => setCodeValue(e.target.value)}
                spellCheck={false}
                style={{
                  width: '100%', height: '100%', padding: '16px 16px 16px 12px',
                  background: 'transparent', color: '#c4b5fd', border: 'none', resize: 'none',
                  fontFamily: 'JetBrains Mono, Consolas, monospace', fontSize: 13, lineHeight: 1.6,
                  outline: 'none', tabSize: 2, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  caretColor: '#C9A94E',
                }}
                onKeyDown={e => {
                  // Tab inserts 2 spaces instead of moving focus
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const ta = e.currentTarget;
                    const start = ta.selectionStart;
                    const end = ta.selectionEnd;
                    setCodeValue(codeValue.substring(0, start) + '  ' + codeValue.substring(end));
                    requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 2; });
                  }
                }}
              />
            </div>
          </div>
          {/* Status bar */}
          <div style={{
            padding: '6px 16px', background: '#080c14', borderTop: '1px solid #1e293b',
            display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7280',
            fontFamily: 'JetBrains Mono, Consolas, monospace', flexShrink: 0,
          }}>
            <span>HTML</span>
            <span>{codeValue.split('\n').length} lines &middot; {codeValue.length} chars</span>
          </div>
        </div>

        {/* Right Panel — GrapeJS managers (always mounted, hidden via CSS to preserve panel bindings) */}
        <div style={{ width: showCode ? 0 : 280, background: '#0f1219', borderLeft: showCode ? 'none' : '1px solid #2a2f3e', display: showCode ? 'none' : 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
          {/* Panel tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #2a2f3e' }}>
            {(['blocks', 'layers', 'style', 'traits'] as const).map(p => (
              <button key={p} onClick={() => setActivePanel(p)}
                style={{ flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
                  background: activePanel === p ? '#1a1f2e' : 'transparent',
                  color: activePanel === p ? '#C9A94E' : '#6b7280',
                  borderBottom: activePanel === p ? '2px solid #C9A94E' : '2px solid transparent',
                }}>{p}</button>
            ))}
          </div>

          {/* Panel content — visibility pattern for GrapeJS */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <div id="blocks-panel" style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'auto', padding: 8,
              visibility: activePanel === 'blocks' ? 'visible' : 'hidden',
              zIndex: activePanel === 'blocks' ? 1 : 0,
            }} />
            <div id="layers-panel" style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'auto',
              visibility: activePanel === 'layers' ? 'visible' : 'hidden',
              zIndex: activePanel === 'layers' ? 1 : 0,
            }} />
            <div id="styles-panel" style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'auto',
              visibility: activePanel === 'style' ? 'visible' : 'hidden',
              zIndex: activePanel === 'style' ? 1 : 0,
            }} />
            <div id="traits-panel" style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'auto',
              visibility: activePanel === 'traits' ? 'visible' : 'hidden',
              zIndex: activePanel === 'traits' ? 1 : 0,
            }} />
          </div>
        </div>
      </div>

      {/* ── PUBLISH MODAL ── */}
      {showPublish && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          onClick={() => setShowPublish(false)}>
          <div style={{ background: '#0f1219', border: '1px solid #2a2f3e', borderRadius: 16, padding: 32, width: 480, maxWidth: '90vw' }}
            onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>Publish Your Website</h2>
            <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 24 }}>Choose how to publish your website.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={() => { handleExportAll(); setShowPublish(false); }}
                style={{ padding: '14px 20px', borderRadius: 10, border: '1px solid #2a2f3e', background: '#1a1f2e', color: '#e2e8f0', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Download HTML Files</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>Export all pages as HTML files you can host anywhere.</div>
              </button>

              <button onClick={() => {
                const html = getCurrentHtml();
                const css = getCurrentCss();
                const full = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${settings.title}</title><meta name="description" content="${settings.description}"><style>${css}</style></head><body>${html}</body></html>`;
                navigator.clipboard.writeText(full);
                setShowPublish(false);
              }}
                style={{ padding: '14px 20px', borderRadius: 10, border: '1px solid #2a2f3e', background: '#1a1f2e', color: '#e2e8f0', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Copy to Clipboard</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>Copy the full HTML to paste into any hosting platform.</div>
              </button>

              <button onClick={() => {
                const html = getCurrentHtml();
                const css = getCurrentCss();
                const full = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${settings.title}</title><style>${css}</style></head><body>${html}</body></html>`;
                const win = window.open('', '_blank');
                if (win) { win.document.write(full); win.document.close(); }
                setShowPublish(false);
              }}
                style={{ padding: '14px 20px', borderRadius: 10, border: '1px solid #C9A94E', background: '#C9A94E22', color: '#C9A94E', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Preview Live</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>Open a full preview in a new tab.</div>
              </button>

              {/* ── Cloud Publish ── */}
              <div style={{ borderTop: '1px solid #2a2f3e', paddingTop: 12, marginTop: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#C9A94E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Echo Cloud Hosting</div>
                <input
                  type="text"
                  placeholder="Custom domain (optional) e.g. mysite.com"
                  value={customDomain}
                  onChange={e => setCustomDomain(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #2a2f3e', background: '#1a1f2e', color: '#e2e8f0', fontSize: 13, outline: 'none', marginBottom: 8 }}
                />
                <button
                  onClick={handlePublishToCloud}
                  disabled={publishStatus === 'publishing'}
                  style={{
                    width: '100%', padding: '14px 20px', borderRadius: 10,
                    border: '1px solid #14b8a6', background: publishStatus === 'publishing' ? '#1a1f2e' : '#14b8a622',
                    color: '#14b8a6', cursor: publishStatus === 'publishing' ? 'default' : 'pointer', textAlign: 'left',
                  }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {publishStatus === 'publishing' ? 'Publishing...' : publishStatus === 'done' ? 'Published!' : 'Publish to Echo Cloud'}
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>
                    {publishStatus === 'done' ? 'Your site is live.' : 'Deploy to our global edge network with custom domain support.'}
                  </div>
                </button>
                {publishStatus === 'done' && publishUrl && (
                  <div style={{ marginTop: 8, padding: '10px 12px', borderRadius: 8, background: '#14b8a611', border: '1px solid #14b8a633' }}>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>Your site is live at:</div>
                    <a href={publishUrl} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#14b8a6', fontSize: 13, fontWeight: 600, wordBreak: 'break-all' }}>{publishUrl}</a>
                  </div>
                )}
                {publishStatus === 'error' && (
                  <div style={{ marginTop: 8, padding: '10px 12px', borderRadius: 8, background: '#ef444411', border: '1px solid #ef444433', fontSize: 12, color: '#fca5a5' }}>
                    Publishing failed. Try downloading HTML instead.
                  </div>
                )}
              </div>
            </div>

            <button onClick={() => setShowPublish(false)}
              style={{ marginTop: 16, width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #2a2f3e', background: 'transparent', color: '#6b7280', cursor: 'pointer', fontSize: 13 }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WebsiteBuilderPage() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050508' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#14b8a6', borderTopColor: 'transparent' }} />
      </div>
    }>
      <BuilderInner />
      <BuilderTutorialPanel />
    </Suspense>
  );
}
