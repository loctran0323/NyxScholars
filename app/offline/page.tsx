export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="max-w-md text-center">
        <p className="text-[12px] text-[var(--accent)] uppercase tracking-[0.22em] font-semibold mb-2">Offline</p>
        <h1 className="text-[28px] font-semibold text-[var(--text-1)] mb-3">No connection.</h1>
        <p className="text-[var(--text-2)] text-[14.5px] leading-relaxed">
          The Nyx portal needs a network to talk to your tutor. Your last viewed page is cached — try
          again as soon as you&apos;re back online.
        </p>
      </div>
    </div>
  );
}
