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

export default function PrivacyPolicyPage() {
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
        <h1 className="text-3xl md:text-5xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>Privacy Policy</h1>
        <p className="text-sm mb-12" style={{ color: 'var(--ept-text-muted)' }}>Last updated: {LAST_UPDATED}</p>

        <Section title="1. Introduction">
          <p>Echo Prime Technologies (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates echo-ept.com and related services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, intelligence engines, APIs, and services.</p>
        </Section>

        <Section title="2. Information We Collect">
          <p><strong>Account Information:</strong> Name, email address, and password when you create an account. Google OAuth profile data if you sign in with Google.</p>
          <p><strong>Usage Data:</strong> Pages visited, features used, queries submitted to intelligence engines, API call logs, and interaction patterns.</p>
          <p><strong>Technical Data:</strong> IP address, browser type, device information, operating system, and referring URLs.</p>
          <p><strong>Payment Data:</strong> Billing information processed through Stripe. We do not store full credit card numbers on our servers.</p>
          <p><strong>Communications:</strong> Messages sent through our chat interface, support requests, and feedback.</p>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use collected information to: provide and improve our services; process transactions; personalize your experience; respond to support requests; send service-related communications; detect and prevent fraud or abuse; comply with legal obligations; and develop new features.</p>
        </Section>

        <Section title="4. Information Sharing">
          <p>We do not sell your personal information. We may share data with: service providers who assist in operating our platform (Cloudflare, Firebase, Stripe, Vercel); law enforcement when required by law; and business partners with your explicit consent.</p>
        </Section>

        <Section title="5. Data Security">
          <p>We implement industry-standard security measures including encryption in transit (TLS 1.3), encryption at rest, access controls, and regular security audits. Our infrastructure runs on Cloudflare&apos;s global edge network with built-in DDoS protection and Web Application Firewall.</p>
        </Section>

        <Section title="6. Data Retention">
          <p>We retain your data for as long as your account is active or as needed to provide services. You may request deletion of your data at any time by contacting us. Some data may be retained for legal compliance purposes.</p>
        </Section>

        <Section title="7. Your Rights">
          <p>You have the right to: access your personal data; correct inaccurate data; request deletion of your data; object to processing; data portability; and withdraw consent. To exercise these rights, contact us at legal@echo-op.com.</p>
        </Section>

        <Section title="8. California Privacy Rights (CCPA)">
          <p>California residents have additional rights under the CCPA, including the right to know what personal information is collected, the right to delete personal information, and the right to opt-out of the sale of personal information. We do not sell personal information.</p>
        </Section>

        <Section title="9. International Transfers">
          <p>Your information may be processed on servers located outside your country of residence. We use Cloudflare&apos;s global network which processes data at the nearest edge location. By using our services, you consent to this transfer.</p>
        </Section>

        <Section title="10. Children&apos;s Privacy">
          <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child, please contact us immediately.</p>
        </Section>

        <Section title="11. Third-Party Services">
          <p>Our platform integrates with third-party services including Firebase (authentication), Cloudflare (infrastructure), Stripe (payments), and Vercel (hosting). Each service has its own privacy policy governing the data they process.</p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our website or sending you an email. Your continued use after changes constitutes acceptance.</p>
        </Section>

        <Section title="13. Contact Us">
          <p>For questions about this Privacy Policy or your data, contact us at <a href="mailto:legal@echo-op.com" style={{ color: 'var(--ept-accent)' }}>legal@echo-op.com</a>.</p>
          <p>Echo Prime Technologies<br />Midland, Texas</p>
        </Section>
      </div>
    </div>
  );
}
