import Link from 'next/link';

const SETTINGS_AREAS = [
  'Profile and contact information',
  'Billing and subscriptions',
  'Security and sign-in methods',
  'Product access and account status',
];

export default function SettingsPage() {
  return (
    <main className="min-h-screen px-6 py-10" style={{ backgroundColor: 'var(--ept-bg)', color: 'var(--ept-text)' }}>
      <section className="mx-auto flex max-w-5xl flex-col gap-10">
        <nav className="flex items-center justify-between gap-4 border-b pb-5" style={{ borderColor: 'var(--ept-border)' }}>
          <Link href="/" className="text-sm font-bold tracking-wide" style={{ color: 'var(--ept-text)' }}>
            Echo Prime Technologies
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
            style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
          >
            Dashboard
          </Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--ept-accent)' }}>
              Account Center
            </p>
            <h1 className="mb-5 text-4xl font-black leading-tight sm:text-5xl" style={{ color: 'var(--ept-text)' }}>
              Manage your Echo Prime account settings.
            </h1>
            <p className="max-w-2xl text-lg leading-8" style={{ color: 'var(--ept-text-secondary)' }}>
              Use this page as the apex entry point for profile, billing, subscription, security, and product access controls.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://app.echo-ept.com/settings"
                className="rounded-lg px-5 py-3 text-sm font-bold"
                style={{ backgroundColor: 'var(--ept-accent)', color: '#fff' }}
              >
                Open Account Console
              </a>
              <Link
                href="/pricing"
                className="rounded-lg border px-5 py-3 text-sm font-bold"
                style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
              >
                Review Plans
              </Link>
            </div>
          </div>

          <div className="rounded-xl border p-6 shadow-sm" style={{ backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)' }}>
            <h2 className="mb-5 text-xl font-extrabold" style={{ color: 'var(--ept-text)' }}>
              Settings available
            </h2>
            <div className="grid gap-3">
              {SETTINGS_AREAS.map((area) => (
                <div
                  key={area}
                  className="rounded-lg border px-4 py-3 text-sm font-semibold"
                  style={{ backgroundColor: 'var(--ept-surface)', borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)' }}
                >
                  {area}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
