export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ept-bg)' }}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }}
        />
        <p className="text-sm font-medium" style={{ color: 'var(--ept-text-muted)' }}>
          Loading...
        </p>
      </div>
    </div>
  );
}
