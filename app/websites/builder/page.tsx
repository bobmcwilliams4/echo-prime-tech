'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';

const TEMPLATE_HTML: Record<string, string> = {
  'SaaS Landing': `<nav style="display:flex;align-items:center;justify-content:space-between;padding:16px 32px;background:#0f1219;border-bottom:1px solid #2a2f3e"><div style="font-size:20px;font-weight:800;color:#C9A94E">YourSaaS</div><div style="display:flex;gap:24px"><a href="#" style="color:#d4d4d8;text-decoration:none;font-size:14px">Features</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Pricing</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Docs</a></div><a href="#" style="padding:10px 24px;background:#C9A94E;color:#fff;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">Start Free</a></nav><section style="padding:100px 24px;text-align:center;background:linear-gradient(135deg,#0a0f1c,#1a1f2e)"><h1 style="font-size:52px;font-weight:800;color:#fff;margin-bottom:16px">Ship faster with AI.</h1><p style="font-size:18px;color:#9ca3af;max-width:600px;margin:0 auto 32px">The platform that turns your ideas into production-ready software in minutes, not months.</p><a href="#" style="display:inline-block;padding:16px 40px;background:#C9A94E;color:#fff;border-radius:12px;font-weight:600;text-decoration:none;font-size:16px">Get Started Free</a></section><section style="padding:80px 24px;max-width:1024px;margin:0 auto"><h2 style="font-size:32px;font-weight:700;text-align:center;margin-bottom:48px">Why teams choose us</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px"><div style="padding:24px;border:1px solid #e5e7eb;border-radius:16px"><h3 style="font-size:18px;font-weight:600;margin-bottom:8px">10x Faster</h3><p style="font-size:14px;color:#6b7280">Build and deploy in minutes. AI handles the boilerplate so you focus on logic.</p></div><div style="padding:24px;border:1px solid #e5e7eb;border-radius:16px"><h3 style="font-size:18px;font-weight:600;margin-bottom:8px">Enterprise Ready</h3><p style="font-size:14px;color:#6b7280">SOC2 compliant, 99.9% uptime SLA, dedicated support for large teams.</p></div><div style="padding:24px;border:1px solid #e5e7eb;border-radius:16px"><h3 style="font-size:18px;font-weight:600;margin-bottom:8px">Zero Lock-in</h3><p style="font-size:14px;color:#6b7280">Export your code anytime. Standard frameworks, no proprietary runtime.</p></div></div></section><section style="padding:64px 24px;text-align:center;background:#C9A94E"><h2 style="font-size:36px;font-weight:800;color:#fff;margin-bottom:16px">Ready to ship?</h2><p style="font-size:16px;color:rgba(255,255,255,0.8);margin-bottom:32px">Join 10,000+ developers building with our platform.</p><a href="#" style="display:inline-block;padding:14px 32px;background:#fff;color:#C9A94E;border-radius:12px;font-weight:600;text-decoration:none">Start Free Trial</a></section><footer style="padding:48px 24px;border-top:1px solid #e5e7eb;text-align:center"><p style="font-size:14px;color:#9ca3af">&copy; 2026 YourSaaS. All rights reserved.</p></footer>`,
  'Portfolio': `<nav style="display:flex;align-items:center;justify-content:space-between;padding:16px 32px;background:#fff;border-bottom:1px solid #e5e7eb"><div style="font-size:20px;font-weight:800;color:#1a1a2e">Jane Doe</div><div style="display:flex;gap:24px"><a href="#" style="color:#374151;text-decoration:none;font-size:14px">Work</a><a href="#" style="color:#6b7280;text-decoration:none;font-size:14px">About</a><a href="#" style="color:#6b7280;text-decoration:none;font-size:14px">Contact</a></div></nav><section style="padding:100px 24px;text-align:center"><h1 style="font-size:48px;font-weight:800;color:#1a1a2e;margin-bottom:16px">Creative Developer</h1><p style="font-size:18px;color:#6b7280;max-width:500px;margin:0 auto">I craft digital experiences that are beautiful, functional, and memorable.</p></section><section style="padding:64px 24px;max-width:1024px;margin:0 auto"><h2 style="font-size:28px;font-weight:700;margin-bottom:32px">Selected Work</h2><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:24px"><div style="aspect-ratio:16/10;background:#f3f4f6;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:32px;color:#9ca3af">Project 1</div><div style="aspect-ratio:16/10;background:#f3f4f6;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:32px;color:#9ca3af">Project 2</div><div style="aspect-ratio:16/10;background:#f3f4f6;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:32px;color:#9ca3af">Project 3</div><div style="aspect-ratio:16/10;background:#f3f4f6;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:32px;color:#9ca3af">Project 4</div></div></section><section style="padding:64px 24px;max-width:600px;margin:0 auto;text-align:center"><h2 style="font-size:28px;font-weight:700;margin-bottom:16px">Let&apos;s work together</h2><p style="font-size:14px;color:#6b7280;margin-bottom:24px">hello@janedoe.com</p></section>`,
  'E-Commerce': `<nav style="display:flex;align-items:center;justify-content:space-between;padding:16px 32px;background:#fff;border-bottom:1px solid #e5e7eb"><div style="font-size:20px;font-weight:800;color:#1a1a2e">MyStore</div><div style="display:flex;gap:24px"><a href="#" style="color:#374151;text-decoration:none;font-size:14px">Shop</a><a href="#" style="color:#6b7280;text-decoration:none;font-size:14px">Collections</a><a href="#" style="color:#6b7280;text-decoration:none;font-size:14px">About</a></div><a href="#" style="font-size:14px;color:#374151;text-decoration:none">Cart (0)</a></nav><section style="padding:80px 24px;text-align:center;background:linear-gradient(135deg,#f8fafc,#e2e8f0)"><h1 style="font-size:48px;font-weight:800;color:#1a1a2e;margin-bottom:16px">New Arrivals</h1><p style="font-size:18px;color:#6b7280;margin-bottom:32px">Discover our latest collection</p><a href="#" style="display:inline-block;padding:14px 32px;background:#1a1a2e;color:#fff;border-radius:8px;font-weight:600;text-decoration:none">Shop Now</a></section><section style="padding:64px 24px;max-width:1024px;margin:0 auto"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px"><div style="border:1px solid #e5e7eb;border-radius:16px;overflow:hidden"><div style="aspect-ratio:1;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:32px;color:#9ca3af">Product</div><div style="padding:16px"><h3 style="font-size:16px;font-weight:600">Product Name</h3><p style="font-size:14px;color:#6b7280;margin:4px 0">Short description</p><div style="font-size:18px;font-weight:700">$49.00</div></div></div><div style="border:1px solid #e5e7eb;border-radius:16px;overflow:hidden"><div style="aspect-ratio:1;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:32px;color:#9ca3af">Product</div><div style="padding:16px"><h3 style="font-size:16px;font-weight:600">Product Name</h3><p style="font-size:14px;color:#6b7280;margin:4px 0">Short description</p><div style="font-size:18px;font-weight:700">$79.00</div></div></div><div style="border:1px solid #e5e7eb;border-radius:16px;overflow:hidden"><div style="aspect-ratio:1;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-size:32px;color:#9ca3af">Product</div><div style="padding:16px"><h3 style="font-size:16px;font-weight:600">Product Name</h3><p style="font-size:14px;color:#6b7280;margin:4px 0">Short description</p><div style="font-size:18px;font-weight:700">$129.00</div></div></div></div></section>`,
  'Restaurant': `<nav style="display:flex;align-items:center;justify-content:space-between;padding:16px 32px;background:#1a1a2e"><div style="font-size:20px;font-weight:800;color:#C9A94E">La Cucina</div><div style="display:flex;gap:24px"><a href="#" style="color:#d4d4d8;text-decoration:none;font-size:14px">Menu</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">About</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Contact</a></div><a href="#" style="padding:10px 24px;background:#C9A94E;color:#fff;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">Reserve a Table</a></nav><section style="padding:120px 24px;text-align:center;background:linear-gradient(135deg,#1a1a2e,#2d1b69)"><h1 style="font-size:52px;font-weight:800;color:#fff;margin-bottom:16px">Authentic Italian Dining</h1><p style="font-size:18px;color:#C9A94E;margin-bottom:32px">Fresh ingredients, timeless recipes, unforgettable experiences.</p><a href="#" style="display:inline-block;padding:16px 40px;background:#C9A94E;color:#fff;border-radius:12px;font-weight:600;text-decoration:none">View Menu</a></section><section style="padding:64px 24px;max-width:800px;margin:0 auto;text-align:center"><h2 style="font-size:28px;font-weight:700;margin-bottom:40px">Our Specialties</h2><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:24px"><div style="padding:24px;border:1px solid #e5e7eb;border-radius:16px"><h3 style="font-size:18px;font-weight:600;margin-bottom:4px">Truffle Risotto</h3><p style="font-size:14px;color:#6b7280">Arborio rice, black truffle, parmigiano</p><p style="font-size:16px;font-weight:700;color:#C9A94E;margin-top:8px">$28</p></div><div style="padding:24px;border:1px solid #e5e7eb;border-radius:16px"><h3 style="font-size:18px;font-weight:600;margin-bottom:4px">Osso Buco</h3><p style="font-size:14px;color:#6b7280">Braised veal shank, gremolata, saffron</p><p style="font-size:16px;font-weight:700;color:#C9A94E;margin-top:8px">$36</p></div></div></section>`,
  'Blog': `<nav style="display:flex;align-items:center;justify-content:space-between;padding:16px 32px;background:#fff;border-bottom:1px solid #e5e7eb"><div style="font-size:20px;font-weight:800;color:#1a1a2e">The Blog</div><div style="display:flex;gap:24px"><a href="#" style="color:#374151;text-decoration:none;font-size:14px">Articles</a><a href="#" style="color:#6b7280;text-decoration:none;font-size:14px">Categories</a><a href="#" style="color:#6b7280;text-decoration:none;font-size:14px">About</a></div></nav><section style="padding:64px 24px;max-width:800px;margin:0 auto"><h1 style="font-size:40px;font-weight:800;color:#1a1a2e;margin-bottom:32px">Latest Posts</h1><article style="padding:24px 0;border-bottom:1px solid #e5e7eb"><span style="font-size:12px;color:#C9A94E;font-weight:600;text-transform:uppercase">Technology</span><h2 style="font-size:24px;font-weight:700;margin:8px 0">The Future of AI in Business</h2><p style="font-size:14px;color:#6b7280;margin-bottom:12px">How artificial intelligence is transforming every industry and what it means for your company.</p><span style="font-size:12px;color:#9ca3af">Jan 15, 2026 &bull; 5 min read</span></article><article style="padding:24px 0;border-bottom:1px solid #e5e7eb"><span style="font-size:12px;color:#C9A94E;font-weight:600;text-transform:uppercase">Design</span><h2 style="font-size:24px;font-weight:700;margin:8px 0">Designing for the Edge</h2><p style="font-size:14px;color:#6b7280;margin-bottom:12px">Why edge-first design principles lead to faster, more resilient web applications.</p><span style="font-size:12px;color:#9ca3af">Jan 10, 2026 &bull; 8 min read</span></article></section>`,
  'Agency': `<nav style="display:flex;align-items:center;justify-content:space-between;padding:16px 32px;background:#0f1219;border-bottom:1px solid #2a2f3e"><div style="font-size:20px;font-weight:800;color:#C9A94E">Agency Co.</div><div style="display:flex;gap:24px"><a href="#" style="color:#d4d4d8;text-decoration:none;font-size:14px">Services</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Work</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Team</a><a href="#" style="color:#9ca3af;text-decoration:none;font-size:14px">Contact</a></div><a href="#" style="padding:10px 24px;background:#C9A94E;color:#fff;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">Get a Quote</a></nav><section style="padding:100px 24px;text-align:center;background:linear-gradient(135deg,#0a0f1c,#1a1f2e)"><h1 style="font-size:52px;font-weight:800;color:#fff;margin-bottom:16px">We build brands that matter.</h1><p style="font-size:18px;color:#9ca3af;max-width:600px;margin:0 auto 32px">Strategy, design, and technology — all under one roof.</p></section><section style="padding:80px 24px;max-width:1024px;margin:0 auto"><h2 style="font-size:28px;font-weight:700;text-align:center;margin-bottom:48px">Our Services</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px"><div style="padding:32px;border:1px solid #e5e7eb;border-radius:16px;text-align:center"><div style="font-size:32px;margin-bottom:16px">🎨</div><h3 style="font-size:18px;font-weight:600;margin-bottom:8px">Brand Design</h3><p style="font-size:14px;color:#6b7280">Logo, identity, guidelines</p></div><div style="padding:32px;border:1px solid #e5e7eb;border-radius:16px;text-align:center"><div style="font-size:32px;margin-bottom:16px">💻</div><h3 style="font-size:18px;font-weight:600;margin-bottom:8px">Web Development</h3><p style="font-size:14px;color:#6b7280">Custom sites and apps</p></div><div style="padding:32px;border:1px solid #e5e7eb;border-radius:16px;text-align:center"><div style="font-size:32px;margin-bottom:16px">📈</div><h3 style="font-size:18px;font-weight:600;margin-bottom:8px">Growth Marketing</h3><p style="font-size:14px;color:#6b7280">SEO, PPC, social media</p></div></div></section>`,
  'Real Estate': `<nav style="display:flex;align-items:center;justify-content:space-between;padding:16px 32px;background:#fff;border-bottom:1px solid #e5e7eb"><div style="font-size:20px;font-weight:800;color:#1a1a2e">Prime Properties</div><div style="display:flex;gap:24px"><a href="#" style="color:#374151;text-decoration:none;font-size:14px">Listings</a><a href="#" style="color:#6b7280;text-decoration:none;font-size:14px">Agents</a><a href="#" style="color:#6b7280;text-decoration:none;font-size:14px">About</a></div><a href="#" style="padding:10px 24px;background:#C9A94E;color:#fff;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">List Property</a></nav><section style="padding:100px 24px;text-align:center;background:linear-gradient(135deg,#0a2e1a,#1a3f2e)"><h1 style="font-size:48px;font-weight:800;color:#fff;margin-bottom:16px">Find Your Dream Home</h1><p style="font-size:18px;color:#d4d4d8;margin-bottom:32px">Search thousands of listings in the Permian Basin</p><div style="max-width:600px;margin:0 auto;display:flex;gap:8px"><input type="text" placeholder="Search by city, ZIP, or address..." style="flex:1;padding:14px 16px;border-radius:8px;border:none;font-size:14px"><button style="padding:14px 24px;background:#C9A94E;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer">Search</button></div></section><section style="padding:64px 24px;max-width:1024px;margin:0 auto"><h2 style="font-size:28px;font-weight:700;margin-bottom:32px">Featured Listings</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px"><div style="border:1px solid #e5e7eb;border-radius:16px;overflow:hidden"><div style="aspect-ratio:16/10;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#9ca3af">Photo</div><div style="padding:16px"><h3 style="font-size:16px;font-weight:600">4 Bed, 3 Bath</h3><p style="font-size:14px;color:#6b7280">123 Main St, Midland TX</p><p style="font-size:18px;font-weight:700;color:#C9A94E;margin-top:8px">$425,000</p></div></div><div style="border:1px solid #e5e7eb;border-radius:16px;overflow:hidden"><div style="aspect-ratio:16/10;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#9ca3af">Photo</div><div style="padding:16px"><h3 style="font-size:16px;font-weight:600">3 Bed, 2 Bath</h3><p style="font-size:14px;color:#6b7280">456 Oak Ave, Odessa TX</p><p style="font-size:18px;font-weight:700;color:#C9A94E;margin-top:8px">$310,000</p></div></div><div style="border:1px solid #e5e7eb;border-radius:16px;overflow:hidden"><div style="aspect-ratio:16/10;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#9ca3af">Photo</div><div style="padding:16px"><h3 style="font-size:16px;font-weight:600">5 Bed, 4 Bath</h3><p style="font-size:14px;color:#6b7280">789 Ranch Rd, Midland TX</p><p style="font-size:18px;font-weight:700;color:#C9A94E;margin-top:8px">$650,000</p></div></div></div></section>`,
  'Medical': `<nav style="display:flex;align-items:center;justify-content:space-between;padding:16px 32px;background:#fff;border-bottom:1px solid #e5e7eb"><div style="font-size:20px;font-weight:800;color:#0d7377">MedCare Clinic</div><div style="display:flex;gap:24px"><a href="#" style="color:#374151;text-decoration:none;font-size:14px">Services</a><a href="#" style="color:#6b7280;text-decoration:none;font-size:14px">Doctors</a><a href="#" style="color:#6b7280;text-decoration:none;font-size:14px">Insurance</a></div><a href="#" style="padding:10px 24px;background:#0d7377;color:#fff;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">Book Appointment</a></nav><section style="padding:80px 24px;text-align:center;background:linear-gradient(135deg,#f0fdfa,#e0f2f1)"><h1 style="font-size:48px;font-weight:800;color:#0d7377;margin-bottom:16px">Your Health, Our Priority</h1><p style="font-size:18px;color:#6b7280;max-width:500px;margin:0 auto 32px">Compassionate care with cutting-edge technology</p><a href="#" style="display:inline-block;padding:14px 32px;background:#0d7377;color:#fff;border-radius:8px;font-weight:600;text-decoration:none">Schedule a Visit</a></section>`,
  'Dashboard': `<div style="display:flex;min-height:100vh"><aside style="width:240px;background:#0f1219;padding:24px 16px;border-right:1px solid #2a2f3e"><div style="font-size:18px;font-weight:800;color:#C9A94E;margin-bottom:32px">Dashboard</div><nav style="display:flex;flex-direction:column;gap:4px"><a href="#" style="display:block;padding:10px 16px;border-radius:8px;background:#1a1f2e;color:#d4d4d8;text-decoration:none;font-size:14px">Overview</a><a href="#" style="display:block;padding:10px 16px;border-radius:8px;color:#9ca3af;text-decoration:none;font-size:14px">Analytics</a><a href="#" style="display:block;padding:10px 16px;border-radius:8px;color:#9ca3af;text-decoration:none;font-size:14px">Settings</a></nav></aside><main style="flex:1;padding:32px;background:#fff"><h1 style="font-size:28px;font-weight:700;margin-bottom:24px">Overview</h1><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px"><div style="padding:24px;background:#f8fafc;border-radius:12px;border:1px solid #e5e7eb"><div style="font-size:12px;color:#6b7280;margin-bottom:4px">Total Users</div><div style="font-size:28px;font-weight:800">12,459</div></div><div style="padding:24px;background:#f8fafc;border-radius:12px;border:1px solid #e5e7eb"><div style="font-size:12px;color:#6b7280;margin-bottom:4px">Revenue</div><div style="font-size:28px;font-weight:800">$84.2K</div></div><div style="padding:24px;background:#f8fafc;border-radius:12px;border:1px solid #e5e7eb"><div style="font-size:12px;color:#6b7280;margin-bottom:4px">Active Sessions</div><div style="font-size:28px;font-weight:800">342</div></div><div style="padding:24px;background:#f8fafc;border-radius:12px;border:1px solid #e5e7eb"><div style="font-size:12px;color:#6b7280;margin-bottom:4px">Uptime</div><div style="font-size:28px;font-weight:800">99.9%</div></div></div></main></div>`,
};

function BuilderInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [gjs, setGjs] = useState<any>(null);
  const [activePanel, setActivePanel] = useState<'blocks' | 'layers' | 'styles'>('blocks');
  const templateName = searchParams.get('template');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !editorRef.current || editorLoaded) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/grapesjs@0.21.13/dist/css/grapes.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/grapesjs@0.21.13/dist/grapes.min.js';
    script.onload = () => {
      const blocksScript = document.createElement('script');
      blocksScript.src = 'https://unpkg.com/grapesjs-blocks-basic@1.0.2/dist/index.min.js';
      blocksScript.onload = () => { initEditor(); };
      document.head.appendChild(blocksScript);
    };
    document.head.appendChild(script);

    function initEditor() {
      const w = (window as any);
      if (!w.grapesjs || !editorRef.current) return;

      const editor = w.grapesjs.init({
        container: editorRef.current,
        height: '100%',
        width: 'auto',
        fromElement: false,
        storageManager: { type: 'local', autosave: true, autoload: true, stepsBeforeSave: 1 },
        plugins: [w['grapesjs-blocks-basic']],
        pluginsOpts: { 'grapesjs-blocks-basic': {} },
        canvas: {
          styles: [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
          ],
        },
        deviceManager: {
          devices: [
            { name: 'Desktop', width: '' },
            { name: 'Tablet', width: '768px', widthMedia: '992px' },
            { name: 'Mobile', width: '375px', widthMedia: '480px' },
          ],
        },
        blockManager: {
          appendTo: '#blocks-panel',
        },
        layerManager: {
          appendTo: '#layers-panel',
        },
        styleManager: {
          appendTo: '#styles-panel',
          sectors: [
            {
              name: 'General',
              open: true,
              properties: [
                'display', 'float', 'position', 'top', 'right', 'left', 'bottom',
              ],
            },
            {
              name: 'Dimension',
              open: false,
              properties: [
                'width', 'height', 'max-width', 'min-height', 'margin', 'padding',
              ],
            },
            {
              name: 'Typography',
              open: false,
              properties: [
                'font-family', 'font-size', 'font-weight', 'letter-spacing',
                'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow',
              ],
            },
            {
              name: 'Decorations',
              open: false,
              properties: [
                'background-color', 'background', 'border-radius', 'border',
                'box-shadow', 'opacity',
              ],
            },
            {
              name: 'Extra',
              open: false,
              properties: ['transition', 'transform', 'cursor', 'overflow'],
            },
          ],
        },
        traitManager: {
          appendTo: '#traits-panel',
        },
        panels: { defaults: [] },
      });

      // Add EPT-branded blocks
      const bm = editor.BlockManager;

      bm.add('ept-hero', {
        label: '<div style="padding:8px 0;"><div style="font-size:24px;margin-bottom:4px;">🏠</div>Hero Section</div>',
        category: 'EPT Sections',
        content: `<section style="padding: 80px 24px; text-align: center; background: linear-gradient(135deg, #0a0f1c 0%, #1a1f2e 100%);">
          <h1 style="font-size: 48px; font-weight: 800; color: #fff; margin-bottom: 16px;">Your Headline Here</h1>
          <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto 32px;">Describe your product or service in one compelling sentence.</p>
          <a href="#" style="display: inline-block; padding: 14px 32px; background: #C9A94E; color: #fff; border-radius: 12px; font-weight: 600; text-decoration: none;">Get Started</a>
        </section>`,
      });

      bm.add('ept-nav', {
        label: '<div style="padding:8px 0;"><div style="font-size:24px;margin-bottom:4px;">📌</div>Navigation Bar</div>',
        category: 'EPT Sections',
        content: `<nav style="display: flex; align-items: center; justify-content: space-between; padding: 16px 32px; background: #0f1219; border-bottom: 1px solid #2a2f3e;">
          <div style="font-size: 20px; font-weight: 800; color: #C9A94E;">YourBrand</div>
          <div style="display: flex; gap: 24px;">
            <a href="#" style="color: #d4d4d8; text-decoration: none; font-size: 14px; font-weight: 500;">Home</a>
            <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 14px; font-weight: 500;">About</a>
            <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 14px; font-weight: 500;">Services</a>
            <a href="#" style="color: #9ca3af; text-decoration: none; font-size: 14px; font-weight: 500;">Contact</a>
          </div>
          <a href="#" style="padding: 10px 24px; background: #C9A94E; color: #fff; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none;">Get Started</a>
        </nav>`,
      });

      bm.add('ept-features', {
        label: '<div style="padding:8px 0;"><div style="font-size:24px;margin-bottom:4px;">⚡</div>Features Grid</div>',
        category: 'EPT Sections',
        content: `<section style="padding: 64px 24px; max-width: 1024px; margin: 0 auto;">
          <h2 style="font-size: 32px; font-weight: 700; text-align: center; margin-bottom: 48px; color: #1a1a2e;">What We Offer</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
            <div style="padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px;">
              <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Feature One</h3>
              <p style="font-size: 14px; color: #6b7280;">Description of this feature and why it matters to your customers.</p>
            </div>
            <div style="padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px;">
              <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Feature Two</h3>
              <p style="font-size: 14px; color: #6b7280;">Description of this feature and why it matters to your customers.</p>
            </div>
            <div style="padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px;">
              <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Feature Three</h3>
              <p style="font-size: 14px; color: #6b7280;">Description of this feature and why it matters to your customers.</p>
            </div>
          </div>
        </section>`,
      });

      bm.add('ept-pricing', {
        label: '<div style="padding:8px 0;"><div style="font-size:24px;margin-bottom:4px;">💰</div>Pricing Table</div>',
        category: 'EPT Sections',
        content: `<section style="padding: 64px 24px; text-align: center;">
          <h2 style="font-size: 32px; font-weight: 700; margin-bottom: 48px;">Simple Pricing</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 900px; margin: 0 auto;">
            <div style="padding: 32px; border: 1px solid #e5e7eb; border-radius: 16px;">
              <h3 style="font-weight: 600; margin-bottom: 8px;">Starter</h3>
              <div style="font-size: 36px; font-weight: 800; margin-bottom: 16px;">$29<span style="font-size: 14px; color: #9ca3af;">/mo</span></div>
              <ul style="list-style: none; padding: 0; text-align: left; font-size: 14px; color: #6b7280;"><li style="margin-bottom: 8px;">✓ Feature 1</li><li style="margin-bottom: 8px;">✓ Feature 2</li><li>✓ Feature 3</li></ul>
            </div>
            <div style="padding: 32px; border: 2px solid #C9A94E; border-radius: 16px; position: relative;">
              <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #C9A94E; color: #fff; padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 600;">Popular</div>
              <h3 style="font-weight: 600; margin-bottom: 8px;">Professional</h3>
              <div style="font-size: 36px; font-weight: 800; margin-bottom: 16px;">$79<span style="font-size: 14px; color: #9ca3af;">/mo</span></div>
              <ul style="list-style: none; padding: 0; text-align: left; font-size: 14px; color: #6b7280;"><li style="margin-bottom: 8px;">✓ Everything in Starter</li><li style="margin-bottom: 8px;">✓ Feature 4</li><li>✓ Feature 5</li></ul>
            </div>
            <div style="padding: 32px; border: 1px solid #e5e7eb; border-radius: 16px;">
              <h3 style="font-weight: 600; margin-bottom: 8px;">Enterprise</h3>
              <div style="font-size: 36px; font-weight: 800; margin-bottom: 16px;">Custom</div>
              <ul style="list-style: none; padding: 0; text-align: left; font-size: 14px; color: #6b7280;"><li style="margin-bottom: 8px;">✓ Everything in Pro</li><li style="margin-bottom: 8px;">✓ Dedicated support</li><li>✓ Custom integrations</li></ul>
            </div>
          </div>
        </section>`,
      });

      bm.add('ept-cta', {
        label: '<div style="padding:8px 0;"><div style="font-size:24px;margin-bottom:4px;">🎯</div>Call to Action</div>',
        category: 'EPT Sections',
        content: `<section style="padding: 80px 24px; text-align: center; background: #C9A94E;">
          <h2 style="font-size: 36px; font-weight: 800; color: #fff; margin-bottom: 16px;">Ready to get started?</h2>
          <p style="font-size: 16px; color: rgba(255,255,255,0.8); margin-bottom: 32px;">Join thousands of businesses using our platform.</p>
          <a href="#" style="display: inline-block; padding: 14px 32px; background: #fff; color: #C9A94E; border-radius: 12px; font-weight: 600; text-decoration: none;">Start Free Trial</a>
        </section>`,
      });

      bm.add('ept-testimonials', {
        label: '<div style="padding:8px 0;"><div style="font-size:24px;margin-bottom:4px;">💬</div>Testimonials</div>',
        category: 'EPT Sections',
        content: `<section style="padding: 64px 24px; max-width: 800px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 32px;">What Our Clients Say</h2>
          <blockquote style="font-size: 18px; font-style: italic; color: #374151; margin-bottom: 16px;">"This product completely transformed our workflow. We saved 40 hours per week."</blockquote>
          <p style="font-size: 14px; font-weight: 600;">Jane Doe</p>
          <p style="font-size: 12px; color: #9ca3af;">CEO, Example Corp</p>
        </section>`,
      });

      bm.add('ept-contact', {
        label: '<div style="padding:8px 0;"><div style="font-size:24px;margin-bottom:4px;">📧</div>Contact Form</div>',
        category: 'EPT Sections',
        content: `<section style="padding: 64px 24px; max-width: 600px; margin: 0 auto;">
          <h2 style="font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 32px;">Get in Touch</h2>
          <form style="display: flex; flex-direction: column; gap: 16px;">
            <input type="text" placeholder="Your Name" style="padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px;" />
            <input type="email" placeholder="Email Address" style="padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px;" />
            <textarea placeholder="Your Message" rows="4" style="padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; resize: vertical;"></textarea>
            <button type="submit" style="padding: 14px; background: #C9A94E; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Send Message</button>
          </form>
        </section>`,
      });

      bm.add('ept-footer', {
        label: '<div style="padding:8px 0;"><div style="font-size:24px;margin-bottom:4px;">📄</div>Footer</div>',
        category: 'EPT Sections',
        content: `<footer style="padding: 48px 24px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="font-size: 14px; color: #9ca3af;">© 2026 Your Company. All rights reserved.</p>
          <div style="margin-top: 16px; display: flex; justify-content: center; gap: 24px;">
            <a href="#" style="font-size: 13px; color: #6b7280; text-decoration: none;">Privacy</a>
            <a href="#" style="font-size: 13px; color: #6b7280; text-decoration: none;">Terms</a>
            <a href="#" style="font-size: 13px; color: #6b7280; text-decoration: none;">Contact</a>
          </div>
        </footer>`,
      });

      bm.add('ept-image-text', {
        label: '<div style="padding:8px 0;"><div style="font-size:24px;margin-bottom:4px;">🖼️</div>Image + Text</div>',
        category: 'EPT Sections',
        content: `<section style="display: flex; align-items: center; gap: 48px; padding: 64px 24px; max-width: 1024px; margin: 0 auto;">
          <div style="flex: 1;">
            <div style="width: 100%; aspect-ratio: 4/3; background: #e5e7eb; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 48px; color: #9ca3af;">◇</div>
          </div>
          <div style="flex: 1;">
            <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 16px;">About Our Company</h2>
            <p style="font-size: 14px; color: #6b7280; line-height: 1.7; margin-bottom: 24px;">We provide cutting-edge solutions that help businesses grow. Our team of experts works around the clock to deliver exceptional results.</p>
            <a href="#" style="display: inline-block; padding: 12px 24px; background: #C9A94E; color: #fff; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 14px;">Learn More</a>
          </div>
        </section>`,
      });

      bm.add('ept-stats', {
        label: '<div style="padding:8px 0;"><div style="font-size:24px;margin-bottom:4px;">📊</div>Stats Bar</div>',
        category: 'EPT Sections',
        content: `<section style="padding: 48px 24px; background: #0f1219;">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 900px; margin: 0 auto; text-align: center;">
            <div><div style="font-size: 36px; font-weight: 800; color: #C9A94E;">500+</div><div style="font-size: 13px; color: #9ca3af; margin-top: 4px;">Customers</div></div>
            <div><div style="font-size: 36px; font-weight: 800; color: #C9A94E;">99.9%</div><div style="font-size: 13px; color: #9ca3af; margin-top: 4px;">Uptime</div></div>
            <div><div style="font-size: 36px; font-weight: 800; color: #C9A94E;">24/7</div><div style="font-size: 13px; color: #9ca3af; margin-top: 4px;">Support</div></div>
            <div><div style="font-size: 36px; font-weight: 800; color: #C9A94E;">50ms</div><div style="font-size: 13px; color: #9ca3af; margin-top: 4px;">Response Time</div></div>
          </div>
        </section>`,
      });

      bm.add('ept-faq', {
        label: '<div style="padding:8px 0;"><div style="font-size:24px;margin-bottom:4px;">❓</div>FAQ Section</div>',
        category: 'EPT Sections',
        content: `<section style="padding: 64px 24px; max-width: 700px; margin: 0 auto;">
          <h2 style="font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 40px;">Frequently Asked Questions</h2>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">How do I get started?</h3>
              <p style="font-size: 14px; color: #6b7280;">Sign up for a free account and you can start building immediately. No credit card required.</p>
            </div>
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Can I cancel anytime?</h3>
              <p style="font-size: 14px; color: #6b7280;">Yes, you can cancel your subscription at any time. No long-term contracts or hidden fees.</p>
            </div>
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Do you offer custom solutions?</h3>
              <p style="font-size: 14px; color: #6b7280;">Absolutely. Contact our team to discuss enterprise plans tailored to your specific needs.</p>
            </div>
          </div>
        </section>`,
      });

      bm.add('ept-team', {
        label: '<div style="padding:8px 0;"><div style="font-size:24px;margin-bottom:4px;">👥</div>Team Section</div>',
        category: 'EPT Sections',
        content: `<section style="padding: 64px 24px; text-align: center;">
          <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 40px;">Meet the Team</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; max-width: 800px; margin: 0 auto;">
            <div>
              <div style="width: 100px; height: 100px; border-radius: 50%; background: #e5e7eb; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #9ca3af;">👤</div>
              <h3 style="font-size: 16px; font-weight: 600;">John Smith</h3>
              <p style="font-size: 13px; color: #9ca3af;">CEO & Founder</p>
            </div>
            <div>
              <div style="width: 100px; height: 100px; border-radius: 50%; background: #e5e7eb; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #9ca3af;">👤</div>
              <h3 style="font-size: 16px; font-weight: 600;">Sarah Johnson</h3>
              <p style="font-size: 13px; color: #9ca3af;">Head of Engineering</p>
            </div>
            <div>
              <div style="width: 100px; height: 100px; border-radius: 50%; background: #e5e7eb; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #9ca3af;">👤</div>
              <h3 style="font-size: 16px; font-weight: 600;">Mike Davis</h3>
              <p style="font-size: 13px; color: #9ca3af;">Head of Design</p>
            </div>
          </div>
        </section>`,
      });

      // Inject EPT theme CSS
      const style = document.createElement('style');
      style.textContent = `
        .gjs-one-bg { background-color: #0f1219 !important; }
        .gjs-two-color { color: #d4d4d8 !important; }
        .gjs-three-bg { background-color: #1a1f2e !important; }
        .gjs-four-color, .gjs-four-color-h:hover { color: #C9A94E !important; }
        .gjs-pn-panel { border-color: #2a2f3e !important; }
        .gjs-block { color: #d4d4d8 !important; border-color: #2a2f3e !important; min-height: auto !important; }
        .gjs-block:hover { border-color: #C9A94E !important; }
        .gjs-toolbar { background-color: #C9A94E !important; }
        .gjs-selected { outline-color: #C9A94E !important; }
        .gjs-highlighter { outline-color: #C9A94E !important; }
        .gjs-badge { background-color: #C9A94E !important; }
        .gjs-cv-canvas { background-color: #1a1f2e !important; }
        .gjs-frame-wrapper { background-color: #fff !important; }
        .gjs-category-title { color: #C9A94E !important; background: #151a24 !important; border-color: #2a2f3e !important; }
        .gjs-layer-title { color: #d4d4d8 !important; }
        .gjs-sm-sector-title { color: #C9A94E !important; background: #151a24 !important; }
        .gjs-field { background: #1a1f2e !important; border-color: #2a2f3e !important; color: #d4d4d8 !important; }
        .gjs-field input, .gjs-field select { color: #d4d4d8 !important; }
        .gjs-trt-trait { color: #d4d4d8 !important; }
        .gjs-clm-tags { background: transparent !important; }
        .gjs-clm-tag { background: #1a1f2e !important; color: #d4d4d8 !important; }
        #gjs-sm-caret-open { border-top-color: #C9A94E !important; }
      `;
      document.head.appendChild(style);

      // Load template if specified in URL
      if (templateName && TEMPLATE_HTML[templateName]) {
        // Clear local storage to prevent old saved data from overriding template
        localStorage.removeItem('gjsProject');
        editor.setComponents(TEMPLATE_HTML[templateName]);
      }

      setGjs(editor);
      setEditorLoaded(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, editorLoaded]);

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#0f1219' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: '#2a2f3e', backgroundColor: '#0f1219' }}>
        <div className="flex items-center gap-3">
          <Link href="/websites" className="text-sm font-medium" style={{ color: '#9ca3af' }}>
            &larr; Back
          </Link>
          <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: '#1a1f2e', color: '#C9A94E' }}>Website Builder</span>
        </div>

        {/* Device switcher */}
        <div className="flex items-center gap-1">
          {[
            { label: '🖥', device: 'Desktop', title: 'Desktop' },
            { label: '📱', device: 'Tablet', title: 'Tablet' },
            { label: '📲', device: 'Mobile', title: 'Mobile' },
          ].map(d => (
            <button
              key={d.device}
              title={d.title}
              onClick={() => gjs?.setDevice(d.device)}
              className="text-sm px-2 py-1 rounded hover:bg-white/5 transition-colors"
              style={{ color: '#9ca3af' }}
            >
              {d.label}
            </button>
          ))}
          <div className="w-px h-5 mx-2" style={{ backgroundColor: '#2a2f3e' }} />
          <button
            onClick={() => gjs?.runCommand('core:undo')}
            title="Undo"
            className="text-sm px-2 py-1 rounded hover:bg-white/5 transition-colors"
            style={{ color: '#9ca3af' }}
          >↩</button>
          <button
            onClick={() => gjs?.runCommand('core:redo')}
            title="Redo"
            className="text-sm px-2 py-1 rounded hover:bg-white/5 transition-colors"
            style={{ color: '#9ca3af' }}
          >↪</button>
          <button
            onClick={() => gjs?.runCommand('core:canvas-clear')}
            title="Clear Canvas"
            className="text-sm px-2 py-1 rounded hover:bg-white/5 transition-colors"
            style={{ color: '#9ca3af' }}
          >🗑</button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (gjs) {
                const html = gjs.getHtml();
                const css = gjs.getCss();
                const full = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${html}</body></html>`;
                const blob = new Blob([full], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'website.html';
                a.click();
                URL.revokeObjectURL(url);
              }
            }}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border"
            style={{ borderColor: '#2a2f3e', color: '#9ca3af' }}
          >
            Export HTML
          </button>
          <button
            onClick={() => {
              if (gjs) {
                const html = gjs.getHtml();
                const css = gjs.getCss();
                const w = window.open('', '_blank');
                if (w) {
                  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${html}</body></html>`);
                  w.document.close();
                }
              }
            }}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border"
            style={{ borderColor: '#2a2f3e', color: '#9ca3af' }}
          >
            Preview
          </button>
          <button
            onClick={() => {
              if (gjs) {
                const html = gjs.getHtml();
                const css = gjs.getCss();
                console.log('HTML:', html, 'CSS:', css);
                alert('Site exported to console. Full publish coming soon.');
              }
            }}
            className="text-xs font-semibold px-4 py-1.5 rounded-lg"
            style={{ backgroundColor: '#C9A94E', color: '#fff' }}
          >
            Publish
          </button>
        </div>
      </div>

      {/* Main editor layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div ref={editorRef} className="flex-1" />

        {/* Right panel */}
        <div className="flex flex-col" style={{ width: '280px', backgroundColor: '#0f1219', borderLeft: '1px solid #2a2f3e' }}>
          {/* Panel tabs */}
          <div className="flex border-b" style={{ borderColor: '#2a2f3e' }}>
            {(['blocks', 'layers', 'styles'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActivePanel(tab)}
                className="flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors"
                style={{
                  color: activePanel === tab ? '#C9A94E' : '#6b7280',
                  borderBottom: activePanel === tab ? '2px solid #C9A94E' : '2px solid transparent',
                  backgroundColor: activePanel === tab ? '#151a24' : 'transparent',
                }}
              >
                {tab === 'blocks' ? 'Blocks' : tab === 'layers' ? 'Layers' : 'Style'}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#0f1219' }}>
            <div id="blocks-panel" style={{ display: activePanel === 'blocks' ? 'block' : 'none', padding: '8px' }} />
            <div id="layers-panel" style={{ display: activePanel === 'layers' ? 'block' : 'none', padding: '8px' }} />
            <div id="styles-panel" style={{ display: activePanel === 'styles' ? 'block' : 'none', padding: '8px' }} />
            <div id="traits-panel" style={{ display: activePanel === 'styles' ? 'block' : 'none', padding: '8px', borderTop: '1px solid #2a2f3e' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f1219' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#C9A94E', borderTopColor: 'transparent' }} />
      </div>
    }>
      <BuilderInner />
    </Suspense>
  );
}
