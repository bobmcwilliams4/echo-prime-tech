'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';

export default function BuilderPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [gjs, setGjs] = useState<any>(null);
  const [activePanel, setActivePanel] = useState<'blocks' | 'layers' | 'styles'>('blocks');

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

      setGjs(editor);
      setEditorLoaded(true);
    }
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
