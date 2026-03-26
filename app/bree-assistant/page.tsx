'use client';
import FaqSchema from '../../components/FaqSchema';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../../lib/theme-context';

/* ══════════════════════════════════════════════════════════════════════════════
   BREE AI → Redirects to Office AI (same product, customized for Clean Brees)
   Live deployments: cleanbrees.echo-ept.com, rah-midland.com, jp.echo-op.com
   ══════════════════════════════════════════════════════════════════════════════ */

const FAQS = [
  { q: 'What happened to Bree AI as a standalone product?', a: 'Bree AI has been fully integrated into Echo Office AI, our comprehensive business operations platform. Every feature Bree offered — scheduling, customer communication, voice interaction — is now part of a much larger suite with 22+ business modules included at no extra cost.' },
  { q: 'Will I lose my existing Bree AI data or settings?', a: 'No. All conversation history, customer preferences, and custom configurations have been migrated to Echo Office AI automatically. Your Bree personality profile, voice settings, and trained responses carry over seamlessly.' },
  { q: 'Can Bree still answer calls and book appointments for my business?', a: 'Absolutely. Bree\'s call handling, appointment booking, and customer service capabilities are fully preserved inside Echo Office AI. She now also handles invoicing, fleet dispatch, payroll queries, and CRM updates in the same conversation.' },
  { q: 'How much does Echo Office AI cost compared to Bree AI?', a: 'Echo Office AI starts at $49/month for small businesses — the same price point as the original Bree AI plan. You get significantly more functionality including invoicing, reporting dashboards, multi-location support, and team management at no additional charge.' },
  { q: 'Is Bree available for industries other than cleaning services?', a: 'Yes. While Bree was originally built for Clean Brees, Echo Office AI now serves any service-based business — property management, home services, salons, medical offices, and more. The AI adapts its personality and workflow to your specific industry.' },
  { q: 'Can I still use Bree\'s voice and personality in Office AI?', a: 'Yes. Bree\'s warm, emotionally intelligent personality is a selectable voice profile inside Echo Office AI. You can also customize tone, formality level, and response style to match your brand. Bree\'s ElevenLabs voice clone is available on Pro plans and above.' },
];

export default function BreeAssistantPage() {
  const router = useRouter();
  const { isDark } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/office-ai'), 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Bree Assistant', href: '/bree-assistant' }]} />
      <FaqSchema faqs={FAQS} />
      <nav className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-card-bg)' }}>
        <Link href="/">
          <Image src={isDark ? '/logo-night.png' : '/logo-day.png'} alt="Echo Prime Technologies" width={400} height={260} className="w-[160px] md:w-[200px] h-auto" style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }} priority />
        </Link>
      </nav>

      <main style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>💖</div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ color: 'var(--ept-text)' }}>
          Bree AI is now part of
          <br />
          <span className="gradient-text">Echo Office AI</span>
        </h1>
        <p className="text-lg mb-8" style={{ color: 'var(--ept-text-secondary)', lineHeight: 1.7 }}>
          Everything Bree can do — and more — is now available in our full AI Office Platform.
          Same personality, same voice, same emotional intelligence. Plus invoicing, fleet management,
          call transcription, and 22+ business modules.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/office-ai" className="px-8 py-3.5 rounded-xl font-semibold text-base" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}>
            Go to Echo Office AI
          </Link>
        </div>

        <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
          <div className="text-sm font-semibold mb-3" style={{ color: 'var(--ept-accent)' }}>Live Deployments</div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { name: 'Clean Brees', domain: 'cleanbrees.echo-ept.com' },
              { name: 'Right At Home', domain: 'rah-midland.com' },
              { name: 'JP Services', domain: 'jp.echo-op.com' },
            ].map(site => (
              <div key={site.domain} className="p-3 rounded-lg border text-center" style={{ borderColor: 'var(--ept-border)' }}>
                <div className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{site.name}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--ept-text-muted)' }}>{site.domain}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm" style={{ color: 'var(--ept-text-muted)' }}>
          Redirecting to Office AI in a few seconds...
        </p>
      </main>

      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--ept-text)' }}>Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map(faq => (
            <div key={faq.q} className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--ept-text)' }}>{faq.q}</h3>
              <p className="text-sm" style={{ color: 'var(--ept-text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
