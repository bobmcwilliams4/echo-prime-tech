'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function TermsPage() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => { const h = new Date().getHours(); setIsDark(h < 6 || h >= 18); document.documentElement.classList.toggle('dark', h < 6 || h >= 18); }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <nav className="border-b px-6 py-4" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/"><Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="EPT" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority /></Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--ept-text)' }}>Terms of Service</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--ept-text-muted)' }}>Last updated: February 19, 2026</p>
        <div className="space-y-6 text-sm leading-relaxed" style={{ color: 'var(--ept-text-secondary)' }}>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>1. Acceptance of Terms</h2>
            <p>By accessing or using Echo Prime Technologies (&quot;EPT&quot;) services, you agree to be bound by these Terms of Service. If you do not agree, do not use our services.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>2. Description of Services</h2>
            <p>EPT provides AI-powered intelligence engines, data pipelines, website creation tools, voice AI, security monitoring, and related technology services. Services are provided on a subscription basis as described on our pricing page.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>3. Account Registration</h2>
            <p>You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. You must notify us immediately of any unauthorized access.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>4. Subscriptions & Payment</h2>
            <p>Subscriptions are billed monthly or annually as selected. All fees are non-refundable except as required by law. We may change pricing with 30 days&apos; written notice. Failure to pay may result in service suspension.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>5. Acceptable Use</h2>
            <p>You agree not to: use our services for illegal purposes; attempt to gain unauthorized access to our systems; reverse engineer our technology; resell access without authorization; transmit malware or harmful code; harass or impersonate others; or violate third-party intellectual property rights.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>6. Intellectual Property</h2>
            <p>All EPT technology, including intelligence engines, algorithms, and interfaces, is our proprietary property. Your subscription grants you a limited, non-exclusive, non-transferable license to use our services. Content you create using our tools belongs to you.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>7. Data Ownership</h2>
            <p>You retain ownership of all data you upload or create using our services. We may use anonymized, aggregated data to improve our services. We will not access your data except as necessary to provide services or as required by law.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>8. Service Availability</h2>
            <p>We target 99.9% uptime for our services. We may perform scheduled maintenance with reasonable notice. We are not liable for downtime caused by factors beyond our control.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>9. Limitation of Liability</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, EPT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>10. Termination</h2>
            <p>Either party may terminate at any time. Upon termination, your access to services will cease. We will retain your data for 30 days to allow export, after which it may be deleted.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>11. Governing Law</h2>
            <p>These terms are governed by the laws of the State of Texas. Any disputes shall be resolved in the courts of Midland County, Texas.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>12. Contact</h2>
            <p>Questions about these terms: <a href="mailto:bob@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>bob@echo-op.com</a> or <a href="mailto:customerservice@echo-op.com" className="underline" style={{ color: 'var(--ept-accent)' }}>customerservice@echo-op.com</a></p>
            <p className="mt-2">Echo Prime Technologies, Midland, Texas</p>
          </section>
        </div>
      </div>
    </div>
  );
}
