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

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !editorRef.current || editorLoaded) return;

    // Load GrapesJS from CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/grapesjs@0.21.13/dist/css/grapes.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/grapesjs@0.21.13/dist/grapes.min.js';
    script.onload = () => {
      const blocksScript = document.createElement('script');
      blocksScript.src = 'https://unpkg.com/grapesjs-blocks-basic@1.0.2/dist/index.min.js';
      blocksScript.onload = () => {
        initEditor();
      };
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
      });

      // Add EPT-branded blocks
      const bm = editor.BlockManager;

      bm.add('ept-hero', {
        label: 'Hero Section',
        category: 'EPT Sections',
        content: `<section style="padding: 80px 24px; text-align: center; background: linear-gradient(135deg, #0a0f1c 0%, #1a1f2e 100%);">
          <h1 style="font-size: 48px; font-weight: 800; color: #fff; margin-bottom: 16px;">Your Headline Here</h1>
          <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto 32px;">Describe your product or service in one compelling sentence.</p>
          <a href="#" style="display: inline-block; padding: 14px 32px; background: #C9A94E; color: #fff; border-radius: 12px; font-weight: 600; text-decoration: none;">Get Started</a>
        </section>`,
      });

      bm.add('ept-features', {
        label: 'Features Grid',
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
        label: 'Pricing Table',
        category: 'EPT Sections',
        content: `<section style="padding: 64px 24px; text-align: center;">
          <h2 style="font-size: 32px; font-weight: 700; margin-bottom: 48px;">Simple Pricing</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 900px; margin: 0 auto;">
            <div style="padding: 32px; border: 1px solid #e5e7eb; border-radius: 16px;">
              <h3 style="font-weight: 600; margin-bottom: 8px;">Starter</h3>
              <div style="font-size: 36px; font-weight: 800; margin-bottom: 16px;">$29<span style="font-size: 14px; color: #9ca3af;">/mo</span></div>
              <ul style="list-style: none; padding: 0; text-align: left; font-size: 14px; color: #6b7280;"><li style="margin-bottom: 8px;">Feature 1</li><li style="margin-bottom: 8px;">Feature 2</li><li>Feature 3</li></ul>
            </div>
            <div style="padding: 32px; border: 2px solid #C9A94E; border-radius: 16px; position: relative;">
              <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #C9A94E; color: #fff; padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 600;">Popular</div>
              <h3 style="font-weight: 600; margin-bottom: 8px;">Professional</h3>
              <div style="font-size: 36px; font-weight: 800; margin-bottom: 16px;">$79<span style="font-size: 14px; color: #9ca3af;">/mo</span></div>
              <ul style="list-style: none; padding: 0; text-align: left; font-size: 14px; color: #6b7280;"><li style="margin-bottom: 8px;">Everything in Starter</li><li style="margin-bottom: 8px;">Feature 4</li><li>Feature 5</li></ul>
            </div>
            <div style="padding: 32px; border: 1px solid #e5e7eb; border-radius: 16px;">
              <h3 style="font-weight: 600; margin-bottom: 8px;">Enterprise</h3>
              <div style="font-size: 36px; font-weight: 800; margin-bottom: 16px;">Custom</div>
              <ul style="list-style: none; padding: 0; text-align: left; font-size: 14px; color: #6b7280;"><li style="margin-bottom: 8px;">Everything in Pro</li><li style="margin-bottom: 8px;">Dedicated support</li><li>Custom integrations</li></ul>
            </div>
          </div>
        </section>`,
      });

      bm.add('ept-cta', {
        label: 'Call to Action',
        category: 'EPT Sections',
        content: `<section style="padding: 80px 24px; text-align: center; background: #C9A94E;">
          <h2 style="font-size: 36px; font-weight: 800; color: #fff; margin-bottom: 16px;">Ready to get started?</h2>
          <p style="font-size: 16px; color: rgba(255,255,255,0.8); margin-bottom: 32px;">Join thousands of businesses using our platform.</p>
          <a href="#" style="display: inline-block; padding: 14px 32px; background: #fff; color: #C9A94E; border-radius: 12px; font-weight: 600; text-decoration: none;">Start Free Trial</a>
        </section>`,
      });

      bm.add('ept-footer', {
        label: 'Footer',
        category: 'EPT Sections',
        content: `<footer style="padding: 48px 24px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="font-size: 14px; color: #9ca3af;">&copy; 2026 Your Company. All rights reserved.</p>
          <div style="margin-top: 16px; display: flex; justify-content: center; gap: 24px;">
            <a href="#" style="font-size: 13px; color: #6b7280; text-decoration: none;">Privacy</a>
            <a href="#" style="font-size: 13px; color: #6b7280; text-decoration: none;">Terms</a>
            <a href="#" style="font-size: 13px; color: #6b7280; text-decoration: none;">Contact</a>
          </div>
        </footer>`,
      });

      bm.add('ept-testimonials', {
        label: 'Testimonials',
        category: 'EPT Sections',
        content: `<section style="padding: 64px 24px; max-width: 800px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 32px;">What Our Clients Say</h2>
          <blockquote style="font-size: 18px; font-style: italic; color: #374151; margin-bottom: 16px;">"This product completely transformed our workflow. We saved 40 hours per week."</blockquote>
          <p style="font-size: 14px; font-weight: 600;">Jane Doe</p>
          <p style="font-size: 12px; color: #9ca3af;">CEO, Example Corp</p>
        </section>`,
      });

      bm.add('ept-contact', {
        label: 'Contact Form',
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

      // Style the editor panels to match EPT theme
      const style = document.createElement('style');
      style.textContent = `
        .gjs-one-bg { background-color: #0f1219 !important; }
        .gjs-two-color { color: #d4d4d8 !important; }
        .gjs-three-bg { background-color: #1a1f2e !important; }
        .gjs-four-color, .gjs-four-color-h:hover { color: #C9A94E !important; }
        .gjs-pn-panel { border-color: #2a2f3e !important; }
        .gjs-block { color: #d4d4d8 !important; border-color: #2a2f3e !important; }
        .gjs-block:hover { border-color: #C9A94E !important; }
        .gjs-toolbar { background-color: #C9A94E !important; }
        .gjs-selected { outline-color: #C9A94E !important; }
        .gjs-highlighter { outline-color: #C9A94E !important; }
        .gjs-badge { background-color: #C9A94E !important; }
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
        <div className="flex items-center gap-2">
          <button onClick={() => { if (gjs) { const html = gjs.getHtml(); const css = gjs.getCss(); console.log('HTML:', html, 'CSS:', css); alert('Site exported to console. Full publish coming soon.'); } }} className="text-xs font-semibold px-4 py-1.5 rounded-lg" style={{ backgroundColor: '#C9A94E', color: '#fff' }}>
            Publish
          </button>
        </div>
      </div>

      {/* Editor */}
      <div ref={editorRef} className="flex-1" />
    </div>
  );
}
