import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-contrast)]">404</p>
      <h1 className="mt-2 text-4xl font-bold">This path wandered off the map</h1>
      <p className="mt-3 text-[var(--muted)]">The page you asked for does not exist. Your saved data is untouched.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian">Home</Link>
        <Link href="/dashboard" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold">Dashboard</Link>
      </div>
    </div>
  );
}
