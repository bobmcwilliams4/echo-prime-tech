'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../../lib/theme-context';

export default function CookiesPage() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>Cookie Policy</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--ept-text-muted)' }}>Last updated: March 7, 2026</p>
        <div className="space-y-6 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>1. What Are Cookies</h2>
            <p>Cookies are small text files placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>2. Cookies We Use</h2>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
                <thead>
                  <tr style={{ borderColor: 'var(--ept-border)' }} className="border-b">
                    <th className="py-2 pr-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Cookie</th>
                    <th className="py-2 pr-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Type</th>
                    <th className="py-2 pr-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Purpose</th>
                    <th className="py-2 font-semibold" style={{ color: 'var(--ept-text)' }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                    <td className="py-2 pr-4 font-mono">ept-theme</td>
                    <td className="py-2 pr-4">Essential</td>
                    <td className="py-2 pr-4">Stores your light/dark theme preference</td>
                    <td className="py-2">1 year</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                    <td className="py-2 pr-4 font-mono">ept-auth</td>
                    <td className="py-2 pr-4">Essential</td>
                    <td className="py-2 pr-4">Authentication session token (Firebase)</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                    <td className="py-2 pr-4 font-mono">_vercel_*</td>
                    <td className="py-2 pr-4">Analytics</td>
                    <td className="py-2 pr-4">Vercel Analytics and Speed Insights</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                    <td className="py-2 pr-4 font-mono">ept-lead</td>
                    <td className="py-2 pr-4">Functional</td>
                    <td className="py-2 pr-4">Lead capture form data (name, email)</td>
                    <td className="py-2">30 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>3. Essential Cookies</h2>
            <p>These cookies are necessary for the website to function. They enable core functionality like authentication, theme preferences, and security. You cannot opt out of essential cookies as the site will not work properly without them.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>4. Analytics Cookies</h2>
            <p>We use Vercel Analytics to understand how visitors interact with our website. This helps us improve performance and user experience. Analytics data is aggregated and does not identify individual users. You can opt out of analytics cookies using your browser settings.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>5. Third-Party Cookies</h2>
            <p>We use Firebase Authentication (Google) for sign-in functionality. Firebase may set cookies to manage authentication state. We do not use advertising cookies, tracking pixels, or social media tracking cookies.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>6. Managing Cookies</h2>
            <p>Most browsers allow you to control cookies through their settings. You can block or delete cookies, but this may affect your experience on our site. To manage cookies:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Chrome: Settings &gt; Privacy and Security &gt; Cookies</li>
              <li>Firefox: Settings &gt; Privacy &amp; Security &gt; Cookies</li>
              <li>Safari: Preferences &gt; Privacy &gt; Manage Website Data</li>
              <li>Edge: Settings &gt; Privacy, Search, and Services &gt; Cookies</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>7. Updates to This Policy</h2>
            <p>We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of our website after changes constitutes acceptance of the updated policy.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>8. Contact Us</h2>
            <p>If you have questions about our use of cookies, please contact us at <a href="mailto:support@echo-ept.com" style={{ color: 'var(--ept-accent)' }}>support@echo-ept.com</a>.</p>
          </section>
        </div>
        <div className="mt-12 flex gap-4 text-sm">
          <Link href="/legal/privacy" style={{ color: 'var(--ept-accent)' }} className="hover:underline">Privacy Policy</Link>
          <Link href="/legal/terms" style={{ color: 'var(--ept-accent)' }} className="hover:underline">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
