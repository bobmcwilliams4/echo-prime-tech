'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../../lib/theme-context';

const LAST_UPDATED = 'March 21, 2026';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ept-text)' }}>{title}</h2>
      <div className="space-y-3" style={{ color: 'var(--ept-text-secondary)', lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function CookieCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-card-border)' }}>
      <h3 className="font-semibold mb-1" style={{ color: 'var(--ept-text)' }}>{name}</h3>
      <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{description}</p>
    </div>
  );
}

export default function CookiePolicyPage() {
  const { isDark } = useTheme();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/" className="flex items-center gap-3">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={140} height={32} style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} />
        </Link>
        <Link href="/legal" className="text-sm font-medium" style={{ color: 'var(--ept-text-secondary)' }}>Back to Legal</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>Cookie Policy</h1>
        <p className="text-sm mb-12" style={{ color: 'var(--ept-text-muted)' }}>Last updated: {LAST_UPDATED}</p>

        <Section title="1. What Are Cookies">
          <p>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, keep you signed in, and understand how you use the site. We use cookies and similar technologies (localStorage, sessionStorage) to improve your experience.</p>
        </Section>

        <Section title="2. How We Use Cookies">
          <div className="grid gap-4 mt-2">
            <CookieCard name="Essential Cookies" description="Required for core functionality: authentication state, session management, and security tokens. These cannot be disabled without breaking the site." />
            <CookieCard name="Functional Cookies" description="Remember your preferences: theme selection (day/night mode), personality settings, language preferences, and UI customizations." />
            <CookieCard name="Analytics Cookies" description="Help us understand usage patterns: page views, feature adoption, error rates, and performance metrics. Used to improve the platform." />
          </div>
        </Section>

        <Section title="3. Local Storage">
          <p>We use browser localStorage to persist: your authentication session (Firebase tokens), theme preference (light/dark), chat history, tutorial progress, lead capture data, and other client-side preferences. This data stays on your device and is not transmitted to our servers unless required for authentication.</p>
        </Section>

        <Section title="4. Third-Party Cookies">
          <p>The following third-party services may set cookies when you use our platform:</p>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm" style={{ color: 'var(--ept-text-secondary)' }}>
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                  <th className="text-left py-2 pr-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Service</th>
                  <th className="text-left py-2 pr-4 font-semibold" style={{ color: 'var(--ept-text)' }}>Purpose</th>
                  <th className="text-left py-2 font-semibold" style={{ color: 'var(--ept-text)' }}>Policy</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="py-2 pr-4">Firebase</td>
                  <td className="py-2 pr-4">Authentication</td>
                  <td className="py-2"><a href="https://firebase.google.com/support/privacy" style={{ color: 'var(--ept-accent)' }}>firebase.google.com</a></td>
                </tr>
                <tr className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="py-2 pr-4">Cloudflare</td>
                  <td className="py-2 pr-4">Security, CDN</td>
                  <td className="py-2"><a href="https://www.cloudflare.com/privacypolicy/" style={{ color: 'var(--ept-accent)' }}>cloudflare.com</a></td>
                </tr>
                <tr className="border-b" style={{ borderColor: 'var(--ept-border)' }}>
                  <td className="py-2 pr-4">Stripe</td>
                  <td className="py-2 pr-4">Payments</td>
                  <td className="py-2"><a href="https://stripe.com/privacy" style={{ color: 'var(--ept-accent)' }}>stripe.com</a></td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Vercel</td>
                  <td className="py-2 pr-4">Hosting, Analytics</td>
                  <td className="py-2"><a href="https://vercel.com/legal/privacy-policy" style={{ color: 'var(--ept-accent)' }}>vercel.com</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="5. Managing Cookies">
          <p>You can control cookies through your browser settings. Most browsers allow you to: view stored cookies; delete individual or all cookies; block cookies from specific or all sites; and set preferences for first-party vs. third-party cookies.</p>
          <p>Note that disabling essential cookies will prevent you from signing in and using authenticated features of our platform.</p>
        </Section>

        <Section title="6. Do Not Track">
          <p>We respect Do Not Track (DNT) browser signals. When we detect a DNT signal, we disable non-essential analytics tracking. Essential cookies required for authentication and security remain active regardless of DNT settings.</p>
        </Section>

        <Section title="7. Updates to This Policy">
          <p>We may update this Cookie Policy to reflect changes in our practices or applicable regulations. Changes will be posted on this page with an updated effective date.</p>
        </Section>

        <Section title="8. Contact Us">
          <p>For questions about our use of cookies, contact us at <a href="mailto:legal@echo-op.com" style={{ color: 'var(--ept-accent)' }}>legal@echo-op.com</a>.</p>
          <p>Echo Prime Technologies<br />Midland, Texas</p>
        </Section>
      </div>
    </div>
  );
}
