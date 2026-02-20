'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../../lib/theme-context';

export default function PrivacyPage() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>Privacy Policy</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Last updated: February 19, 2026</p>
        <div className="prose-ept space-y-6 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>1. Information We Collect</h2>
            <p>When you create an account, we collect your name, email address, and authentication credentials through Google, Apple, email/password, or phone number sign-in. When you use our services, we collect usage data including queries, API calls, and interaction patterns to improve our products.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>2. How We Use Your Information</h2>
            <p>We use your information to: provide and maintain our services; process your subscription and billing; send you service-related communications; improve and personalize your experience; detect and prevent fraud or abuse; and comply with legal obligations.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>3. Data Storage & Security</h2>
            <p>Your data is stored on Cloudflare&apos;s global edge network with AES-256 encryption at rest and TLS 1.3 in transit. We implement industry-standard security measures including zero-trust access controls, automated threat monitoring, and regular security audits. Account credentials are managed through Firebase Authentication.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>4. Data Sharing</h2>
            <p>We do not sell your personal information. We may share data with: service providers who assist in operating our platform (Cloudflare, Firebase, Stripe); law enforcement when required by law; and in connection with a merger, acquisition, or sale of assets, with prior notice.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>5. Your Rights</h2>
            <p>You have the right to: access your personal data; correct inaccurate data; delete your account and associated data; export your data in a portable format; opt out of marketing communications; and lodge a complaint with a supervisory authority.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>6. Cookies & Tracking</h2>
            <p>We use essential cookies for authentication and session management. We do not use third-party tracking cookies or advertising pixels. Our analytics are privacy-first and do not track individual users across websites.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>7. Children&apos;s Privacy</h2>
            <p>Our services are not directed to individuals under 18. We do not knowingly collect personal information from children.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>8. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify you of material changes via email or through our platform.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>9. Contact</h2>
            <p>For privacy inquiries: <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>bob@echo-op.com</a> or <a href="mailto:customerservice@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>customerservice@echo-op.com</a></p>
            <p className="mt-2">Echo Prime Technologies, Midland, Texas</p>
          </section>
        </div>
      </div>
    </div>
  );
}
